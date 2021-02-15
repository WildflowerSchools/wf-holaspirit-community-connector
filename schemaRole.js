function getRoleFields() {
  const fields = cc.getFields()
  const types = cc.FieldType
  const aggregations = cc.AggregationType

  fields
    .newDimension()
    .setId('roleId')
    .setName('ID')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('name')
    .setName('Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('purpose')
    .setName('Purpose')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('fteFilledMemberCount')
    .setName('FTE Filled Member Count')
    .setType(types.NUMBER)
    
  fields
    .newDimension()
    .setId('fteValue')
    .setName('FTE Value')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('membersCount')
    .setName('Members Count')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('parentCircleId')
    .setName('Parent Circle ID')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('createdAt')
    .setName('Created At')
    .setType(types.YEAR_MONTH_DAY)

  return fields
}

/**
 * Formats a single row of data into the required format.
 *
 * @param {Object} requestedFields Fields requested in the getData request.
 * @param {Object} role
 * @returns {Object} Contains values for requested fields in predefined format.
 */
function formatRoleData(requestedFieldsArray, role) {
  const row = requestedFieldsArray.map(function(requestedField) {
    switch (requestedField.getId()) {
      case 'roleId':
        return role.id
      case 'parentCircleId':
        return role.parentCircle
      case 'name':
        return role.name
      case 'purpose':
        return role.purpose
      case 'fteFilledMemberCount':
        return role.timeSpent.FTEFilledMemberCount
      case 'fteValue':
        return role.timeSpent.FTEValue
      case 'membersCount':
        return role.timeSpent.totalMemberCount
      case 'createdAt':
        if (role.createdAt === null) {
          return null
        }
        return moment(role.createdAt).format("YYYYMMDD") 
      default:
        return ''
    }
  })
  return {values: row}
}

/**
 * Formats the parsed response from external data source into correct tabular
 * format and returns only the requestedFields
 *
 * @param {Object} roles The roles object
 * @param {Array} requestedFields The fields requested in the getData request.
 * @returns {Array} Array containing rows of data in key-value pairs for each
 *     field.
 */
function getFormattedRolesData(roles, requestedFields) {
  const requestedFieldsArray = requestedFields.asArray()
  const formattedRoles = roles.map((role) => {
    return formatRoleData(requestedFieldsArray, role)
  })
  return formattedRoles
}