function triggerRefreshData() {
  const token = getToken()
  
  fetchMemberAllocations(token, ignoreCache=true)
}
