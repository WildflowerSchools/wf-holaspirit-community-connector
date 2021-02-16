const cc = DataStudioApp.createCommunityConnector()

// https://developers.google.com/datastudio/connector/reference#getauthtype
function getAuthType() {
  return cc.newAuthTypeResponse()
    .setAuthType(cc.AuthType.USER_PASS)
    .setHelpUrl('https://www.example.org/connector-auth-help')
    .build()
}

function validateTokenCredentialsOrAttemptRefresh(token, username, password) {
  let meResponse = fetchMe(token)

  if (meResponse === false) {
    const token = fetchToken(username, password)
    if (token === false) {
      return false
    } else {
      meResponse = fetchMe(token)
      organization_id = meResponse.organizations[0]

      const userProperties = PropertiesService.getUserProperties()
      userProperties.setProperty('wfhs.token', token)
      userProperties.setProperty('wfhs.organization_id', organization_id)
    }
  }

  return true
}

function getToken() {
  const userProperties = PropertiesService.getUserProperties()
  return userProperties.getProperty('wfhs.token') 
}

function getOrganizationId() {
  const userProperties = PropertiesService.getUserProperties()
  return userProperties.getProperty('wfhs.organization_id')
}

function setCredentials(request) {
  const creds = request.userPass
  const username = creds.username
  const password = creds.password

  // Optional
  // Check if the provided username and token are valid through a
  // call to your service.
  const token = fetchToken(username, password)
  if (token == false) {
    return {
      errorCode: 'INVALID_CREDENTIALS'
    }
  }

  const meResponse = fetchMe(token)
  organization_id = meResponse.organizations[0]

  const userProperties = PropertiesService.getUserProperties()
  userProperties.setProperty('wfhs.username', username)
  userProperties.setProperty('wfhs.password', password)
  userProperties.setProperty('wfhs.token', token)
  userProperties.setProperty('wfhs.organization_id', organization_id)
  return {
    errorCode: 'NONE'
  };
}

function resetAuth() {
  const user_tokenProperties = PropertiesService.getUserProperties()
  user_tokenProperties.deleteProperty('wfhs.username')
  user_tokenProperties.deleteProperty('wfhs.password')
  user_tokenProperties.deleteProperty('wfhs.token')
  user_tokenProperties.deleteProperty('wfhs.organization_id')
}

function testResetAuth() {
  resetAuth()
}

function isAuthValid() {
  const userProperties = PropertiesService.getUserProperties()
  const username = userProperties.getProperty('wfhs.username')
  const password = userProperties.getProperty('wfhs.password')
  const organizationId = userProperties.getProperty('wfhs.organization_id')

  let token = userProperties.getProperty('wfhs.token')
  if (organizationId === null) {
    token = ""
  }
  
  // This assumes you have a validateCredentials function that
  // can validate if the userName and token are correct.
  return validateTokenCredentialsOrAttemptRefresh(token, username, password)
}

function isAdminUser() {
  var email = Session.getActiveUser().getEmail()
  if (email === "ben.talberg@wildflowerschools.org" || email === "tech@wildflowerschools.org") {
    return true
  } else {
    return false
  }
}

function __testValidateTokenCredentialsOrAttemptRefresh() {
  validateTokenCredentialsOrAttemptRefresh("", "", "")
}
