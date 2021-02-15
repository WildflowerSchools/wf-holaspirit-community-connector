function getMemberRoleAssignmentFields() {
  const fields = cc.getFields()
  const types = cc.FieldType
  const aggregations = cc.AggregationType

  fields
    .newDimension()
    .setId('memberRoleAssignmentId')
    .setName('ID')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberId')
    .setName('Member ID')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('roleId')
    .setName('Role ID')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('coreMember')
    .setName('Core Member')
    .setType(types.BOOLEAN)

  fields
    .newDimension()
    .setId('fteOfMember')
    .setName('FTE of Member')
    .setType(types.NUMBER)
    
  fields
    .newDimension()
    .setId('fteValue')
    .setName('FTE Value')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('assignedUntil')
    .setName('Assigned Until')
    .setType(types.YEAR_MONTH_DAY)

  return fields
}

/**
 * Formats a single row of data into the required format.
 *
 * @param {Object} requestedFields Fields requested in the getData request.
 * @param {Object} memberRoleAssignment
 * @returns {Object} Contains values for requested fields in predefined format.
 */
function formatMemberRoleAssignmentData(requestedFieldsArray, memberRoleAssignment) {
  const row = requestedFieldsArray.map(function(requestedField) {
    switch (requestedField.getId()) {
      case 'memberRoleAssignmentId':
        return memberRoleAssignment.id
      case 'memberId':
        return memberRoleAssignment.member
      case 'roleId':
        return memberRoleAssignment.role
      case 'coreMember':
        return memberRoleAssignment.coreMember
      case 'fteOfMember':
        return memberRoleAssignment.timeSpent.FTEOfMember
      case 'fteValue':
        return memberRoleAssignment.timeSpent.FTEValue
      case 'assignedUntil':
        if (memberRoleAssignment.assignedUntil === null) {
          return null
        }
        return moment(memberRoleAssignment.assignedUntil).format("YYYYMMDD") 
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
 * @param {Object} memberRoleAssignments The memberRoleAssignments object
 * @param {Array} requestedFields The fields requested in the getData request.
 * @returns {Array} Array containing rows of data in key-value pairs for each
 *     field.
 */
function getFormattedMemberRoleAssignmentsData(memberRoleAssignments, requestedFields) {
  const requestedFieldsArray = requestedFields.asArray()
  const formattedMemberRoleAssignments = memberRoleAssignments.map((memberRoleAssignment) => {
    return formatMemberRoleAssignmentData(requestedFieldsArray, memberRoleAssignment)
  })
  return formattedMemberRoleAssignments
}