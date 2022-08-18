// Thanks to: https://gist.github.com/pilbot/9d0567ef1daf556449fb

class ChunkyCache {
  constructor(cache, chunkSize=1024*90) {
    this.cache = cache
    this.chunkSize = chunkSize
  }

  put(key, value, timeout=60*60*24) {
    const json = JSON.stringify(value)
    if (json === undefined) {
      Logger.log(`Failed writing to key+value to cache, key: ${key}`)
      return
    }
    
    const cSize = Math.floor(this.chunkSize / 2)
    let chunks = []
    let index = 0
    
    while (index < json.length){
      const cKey = key + "_" + index
      chunks.push(cKey)
      this.cache.put(cKey, json.substr(index, cSize), timeout+5)
      index += cSize
    }
    
    const superBlk = {
      chunkSize: this.chunkSize,
      chunks: chunks,
      length: json.length
    }
    this.cache.put(key, JSON.stringify(superBlk), timeout)
  }

  get(key) {
    const superBlkCache = this.cache.get(key);
    if (superBlkCache != null) {
      const superBlk = JSON.parse(superBlkCache);
      
      const this_cache = this.cache // Otherwise not available in map()
      const chunks = superBlk.chunks.map(function (cKey){
        return this_cache.get(cKey)
      })
      if (chunks.every(function (c) { return c != null; })){
        return JSON.parse(chunks.join(''))
      }
    }
  }

  getOrExecute(key, fx) {
    const check = this.get(key)
    if (check !== null && check !== undefined && check !== false) {
      return check
    }

    const data = fx()
    this.put(key, data)
    return data
  }
}