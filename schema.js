// https://developers.google.com/datastudio/connector/reference#getschema
function getSchema(request) {
  recordType = request.configParams.record_type
  switch (recordType) {
    case 'members':
      return {schema: getMemberFields().build()}
    case 'circles':
      return {schema: getCircleFields().build()}
    case 'roles':
      return {schema: getRoleFields().build()}
    case 'memberRoleAssignments':
      return {schema: getMemberRoleAssignmentFields().build()}
    case 'memberAllocations':
      return {schema: getMemberAllocationFields().build()}
    default:
      throw(`Unsupported schema type ${recordType}`)
  }
}