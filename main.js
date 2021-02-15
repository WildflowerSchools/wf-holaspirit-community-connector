// https://developers.google.com/datastudio/connector/reference#getdata
function getData(request) {
  request.configParams = validateConfig(request.configParams);

  recordType = request.configParams.record_type

  switch (recordType) {
    case 'members':
      recordFields = getMemberFields()
      break
    case 'circles':
      recordFields = getCircleFields()
      break
    case 'roles':
      recordFields = getRoleFields()
      break
    case 'memberRoleAssignments':
      recordFields = getMemberRoleAssignmentFields()
      break
    case 'memberAllocations':
      recordFields = getMemberAllocationFields()
      break
    default:
      throw(`Unsupported schema type ${request.configParams.record_type}`)
  }

  const requestedFields = recordFields.forIds(
    request.fields.map(function(field) {
      return field.name
    })
  )

  let data = []
  try {
    switch (recordType) {
    case 'members':
      const members = fetchMembers(getToken())
      data = getFormattedMembersData(members, requestedFields)
      break
    case 'circles':
      const circles = fetchCircles(getToken())
      data = getFormattedCirclesData(circles, requestedFields)
      break
    case 'roles':
      const roles = fetchRoles(getToken())
      data = getFormattedRolesData(roles, requestedFields)
      break
    case 'memberRoleAssignments':
      const memberRoleAssignments = fetchMemberRoleAssignments(getToken())
      data = getFormattedMemberRoleAssignmentsData(memberRoleAssignments, requestedFields)
      break
    case 'memberAllocations':
      const memberAllocations = fetchMemberAllocations(getToken())
      data = getFormattedMemberAllocationsData(memberAllocations, requestedFields)
      break
    default:
      throw(`Unsupported schema type ${request.configParams.record_type}`)
    }
  } catch (e) {
    Logger.log(e)
    cc.newUserError()
      .setDebugText('Error fetching data from API. Exception details: ' + e)
      .setText(
        'The connector has encountered an unrecoverable error. Please try again later, or file an issue if this error persists.'
      )
      .throwException()
  }

  return {
    schema: requestedFields.build(),
    rows: data
  }
}

function testGetData() {
  getData({configParams: {}})
}