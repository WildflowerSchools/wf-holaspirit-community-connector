const BASE_URL = "https://app.holaspirit.com"
const CLIENT_ID = "54cb79d0279871e1248b4567_400tdzqbdcowsskk08gws0wkwogck00w084w4s8w8gok08s0o8"

/**
 * Gets response for UrlFetchApp.
 *
 * @param {string} url URL to fetch
 * @returns {string} Response text for UrlFetchApp.
 */
function fetchDataFromApi(path="/", params={}, authToken=null) {
  const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&')
  const url = `${BASE_URL}${path}?${queryString}`

  options = {headers: {}, muteHttpExceptions: true}
  if (authToken !== null) {
    options.headers["Authorization"] = `Bearer ${authToken}`
  }
  const response = UrlFetchApp.fetch(url, options)
  
  const responseCode = response.getResponseCode()
  const responseBody = response.getContentText()

  if (responseCode === 200) {
    return JSON.parse(responseBody)
  } else {
    Logger.log(Utilities.formatString("Request failed: %s. Expected 200, got %d: %s", url, responseCode, responseBody))
    return false
  }
}

function fetchToken(username, password) {
  response = fetchDataFromApi("/oauth/v2/token", {
    client_id: CLIENT_ID,
    grant_type: "password",
    username: username,
    password: password
  })

  if (response == false) {
    return response
  } else {
    return response.access_token
  }
}

function fetchMe(token) {
  const response = fetchDataFromApi("/api/me", {}, token)
  if (response === false) {
    return response
  } else {
    return response.data
  }
}

function fetchOrganization(token, ignoreCache=false) {
  const chunky = new ChunkyCache(CacheService.getScriptCache())

  const fx = () => {
    const organization_id = getOrganizationId()
    const response = fetchDataFromApi(`/api/organizations/${organization_id}`, {}, token)
    if (response == false) {
      return response
    } else {
      return response.data
    }
  }

  if (ignoreCache) {
    return fx()
  } else {
    return chunky.getOrExecute("api__fetch_organization", fx)
  }
}

function fetchMemberTimespent(token, member_id, ignoreCache=false) {
  const chunky = new ChunkyCache(CacheService.getScriptCache())

  const fx = () => {
    const organization_id = getOrganizationId()
    const response = fetchDataFromApi(`/api/organizations/${organization_id}/members/${member_id}/timespent`, {}, token)
    if (response == false) {
      return response
    } else {
      return response.data
    }
  }

  if (ignoreCache) {
    return fx()
  } else {
    return chunky.getOrExecute(`api__fetch_member_timespent__${member_id}`, fx)
  }
}

function paginate(url, token, dataKeyPath="data", pageCount=100) {
  let nextPage = 1
  let paginatedData = []
  while (nextPage !== null) {
    const response = fetchDataFromApi(
      url,
      {count: pageCount, page: nextPage},
      token)

    if (response == false) {
      return response
    }

    nextPage = response.pagination.nextPage
    const data = dataKeyPath.split('.').reduce((previous, current) => previous[current], response)
    paginatedData.push(data)
  }
  return paginatedData.flat()
}

function fetchMembers(token, ignoreCache=false) {
  const chunky = new ChunkyCache(CacheService.getScriptCache())

  const formattedMembers = chunky.get("api__fetch_members__formatted")
  if (formattedMembers !== null && formattedMembers !== undefined) {
    return formattedMembers
  }

  const fx = () => {
    const organization_id = getOrganizationId()
    return paginate(`/api/organizations/${organization_id}/members`, token)
  }

  let members = []
  if (ignoreCache) {
    members = fx()
  } else {
    members = chunky.getOrExecute("api__fetch_members", fx)
  }

  /** /////////////////////////////////////////
   * Custom formatting (start)
   *    - Add the members fullTimeEquivalent (adds an additional fetch request)
   *    - Add the organization data
   */ /////////////////////////////////////////
  const organization = fetchOrganization(token)
  members = members.map((m) => {
    const timespentData = fetchMemberTimespent(getToken(), m.id)
    m.fullTimeEquivalent = timespentData.fullTimeEquivalent

    m.allocatedTimeAsPercent = timespentData.times.reduce((accumulator=0, time) => {
      return accumulator + time.timeSpent
    }, 0) / 100

    m.remainingTimeAsPercent = 1 - m.allocatedTimeAsPercent

    m.organization = organization

    return m
  })

  chunky.put('api__fetch_members__formatted', members)

  return members
}

function fetchCircles(token, ignoreCache=false) {
  const chunky = new ChunkyCache(CacheService.getScriptCache())

  const formattedCircles = chunky.get("api__fetch_circles__formatted")
  if (formattedCircles !== null && formattedCircles !== undefined) {
    return formattedCircles
  }

  const fx = () => {
    const organization_id = getOrganizationId()
    return paginate(`/api/organizations/${organization_id}/circles`, token)
  }

  let circles = []
  if (ignoreCache) {
    circles = fx()
  } else {
    circles = chunky.getOrExecute("api__fetch_circles", fx)
  }

  /** /////////////////////////////////////////
   * Custom formatting (start)
   *    - Add a cumulative total FTE that includes sub-circle FTEs
   */ /////////////////////////////////////////
  let circlesById = {}
  circles.forEach((circle) => {
    circle['children'] = []
    circle['parentCircleName'] = null
    circlesById[circle.id] = circle
  })

  circles.forEach((circle) => {
    if (circle.parentCircle !== null) {
      circlesById[circle.parentCircle].children.push(circle)
    }
  })

  const computeCircleTotalFTE = (circle, _circlesById) => {
    fteTotal = circle.timeSpent.FTEValue
    circle.children.forEach((_, idx, _childCircles) => {
      fteTotal += computeCircleTotalFTE(_childCircles[idx], _circlesById)
    })
    circle.fteTotal = fteTotal
    return fteTotal
  }
  circles.forEach((circle) => {
    computeCircleTotalFTE(circle, circlesById)
    if (circle['parentCircle'] !== null) {
      circle['parentCircleName'] = circlesById[circle['parentCircle']].name
    }
  })
  /** /////////////////////////////////////////
   * Custom formatting (end)
   */ /////////////////////////////////////////

  chunky.put('api__fetch_circles__formatted', circles)

  return circles
}

function fetchRoles(token, ignoreCache=false) {
  const chunky = new ChunkyCache(CacheService.getScriptCache())
  
  const fx = () => {
    const organization_id = getOrganizationId()
    return paginate(`/api/organizations/${organization_id}/roles`, token)
  }

  if (ignoreCache) {
    return fx()
  } else {
    return chunky.getOrExecute("api__fetch_roles", fx)
  }
}

function fetchMemberRoleAssignments(token, ignoreCache=false) {
  const chunky = new ChunkyCache(CacheService.getScriptCache())

  const fx = () => {
    const organization_id = getOrganizationId()
    const records = paginate(`/api/organizations/${organization_id}/roles`, token, "linked.assignedmembers")

    // Records may include duplicates, use the follow functional trickery to filter out dupes
    const uniqueRecords = [
      ...new Set(records.map((r) => JSON.stringify(r)))
    ].map((stringified) => JSON.parse(stringified))

    return uniqueRecords
  }

  if (ignoreCache) {
    return fx()
  } else {
    return chunky.getOrExecute("api__fetch_member_role_assignments", fx)
  }
}

function fetchMemberAllocations(token) {
  const memberRoleAssignations = fetchMemberRoleAssignments(token)
  
  const organization = fetchOrganization(token)

  const members = fetchMembers(token)
  let membersById = {}
  members.forEach(function(data){
      membersById[data['id']] = data
  })

  const circles = fetchCircles(token)
  let circlesById = {}
  circles.forEach(function(data){
      circlesById[data['id']] = data
  })

  const roles = fetchRoles(token)
  let rolesById = {}
  roles.forEach(function(data){
      rolesById[data['id']] = data
  })

  const final = memberRoleAssignations.map(mra => {
    mra.organization = organization
    mra.role = rolesById[mra.role]
    mra.circle = circlesById[mra.role.parentCircle]
    mra.member = membersById[mra.member]
    return mra
  })

  return final
}

function __testFetchMembers() {
  const token = ''
  console.log(fetchMembers(token))

  let members = fetchMembers(getToken())

  members = members.map((m) => {
    const timespentData = fetchMemberTimespent(getToken(), m.id)
    m.fullTimeEquivalent = timespentData.fullTimeEquivalent
    return m
  })
  console.log(members)
}

function __testFetchCircles() {
  const token = ''
  const circles = fetchCircles(token)
  circles.forEach(function(circle){
    console.log(`Circle: ${circle.name} - ${circle.fteTotal}. Parent: ${circle.parentCircleName}`)
  })
}

function __testFetchMemberAllocations() {
  const token = ''
  return fetchMemberAllocations(token)
}
