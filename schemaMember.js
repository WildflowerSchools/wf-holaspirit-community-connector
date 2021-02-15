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
    .setId('email')
    .setName('Email')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('displayName')
    .setName('Display Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('firstName')
    .setName('First Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('lastName')
    .setName('Last Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('bio')
    .setName('Bio')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('location')
    .setName('Location')
    .setType(types.TEXT)

  fields
    .newMetric()
    .setId('rolesCount')
    .setName('Roles Count')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('createdAt')
    .setName('Created At')
    .setType(types.YEAR_MONTH_DAY)

  fields
    .newDimension()
    .setId('lastLoginAt')
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
      case 'email':
        return member.email
      case 'displayName':
        return member.displayName
      case 'firstName':
        return member.firstName
      case 'lastName':
        return member.lastName
      case 'bio':
        if (member.customFields.hasOwnProperty('3PublicBio256CharacterMax')) {
          return member.customFields['3PublicBio256CharacterMax'].value
        } else {
          return ""
        }
      case 'location':
        if (member.customFields.hasOwnProperty('1Location')) {
          return member.customFields['1Location'].value
        } else {
          return ""
        }
      case 'rolesCount':
        return member.rolesCount
      case 'createdAt':
        if (member.createdAt === null) {
          return null
        }
        return moment(member.createdAt).format("YYYYMMDD") 
      case 'lastLoginAt':
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