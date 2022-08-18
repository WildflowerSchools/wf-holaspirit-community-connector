function triggerRefreshData() {
  const token = getToken()
  
  fetchMemberAllocations(token, true)
}
