function getMemberFields() {
  const fields = cc.getFields()
  const types = cc.FieldType
  const aggregations = cc.AggregationType

  fields
    .newDimension()
    .setId('memberId')
    .setName('ID')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberEmail')
    .setName('Email')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberDisplayName')
    .setName('Display Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberFirstName')
    .setName('First Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberLastName')
    .setName('Last Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberBio')
    .setName('Bio')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberLocation')
    .setName('Location')
    .setType(types.TEXT)

  fields
    .newMetric()
    .setId('memberRolesCount')
    .setName('Roles Count')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('memberCreatedAt')
    .setName('Created At')
    .setType(types.YEAR_MONTH_DAY)

  fields
    .newDimension()
    .setId('memberLastLoginAt')
    .setName('Last Login At')
    .setType(types.YEAR_MONTH_DAY)

  return fields
}

/**
 * Formats a single row of data into the required format.
 *
 * @param {Object} requestedFields Fields requested in the getData request.
 * @param {Object} member
 * @returns {Object} Contains values for requested fields in predefined format.
 */
function formatMemberData(requestedFieldsArray, member) {
  const row = requestedFieldsArray.map(function(requestedField) {
    switch (requestedField.getId()) {
      case 'memberId':
        return member.id
      case 'memberEmail':
        return member.email
      case 'memberDisplayName':
        return member.displayName
      case 'memberFirstName':
        return member.firstName
      case 'memberLastName':
        return member.lastName
      case 'memberBio':
        if (member.customFields.hasOwnProperty('3PublicBio256CharacterMax')) {
          return member.customFields['3PublicBio256CharacterMax'].value
        } else {
          return ""
        }
      case 'memberLocation':
        if (member.customFields.hasOwnProperty('1Location')) {
          return member.customFields['1Location'].value
        } else {
          return ""
        }
      case 'memberRolesCount':
        return member.rolesCount
      case 'memberCreatedAt':
        if (member.createdAt === null) {
          return null
        }
        return moment(member.createdAt).format("YYYYMMDD") 
      case 'memberLastLoginAt':
        if (member.lastLoginAt === null) {
          return null
        }
        return moment(member.lastLoginAt).format("YYYYMMDD") 
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
 * @param {Object} member The member object
 * @param {Array} requestedFields The fields requested in the getData request.
 * @returns {Array} Array containing rows of data in key-value pairs for each
 *     field.
 */
function getFormattedMembersData(members, requestedFields) {
  const requestedFieldsArray = requestedFields.asArray()
  const formattedMembers = members.map((member) => {
    return formatMemberData(requestedFieldsArray, member)
  })
  return formattedMembers
}