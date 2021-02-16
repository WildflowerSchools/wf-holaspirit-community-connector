function getCircleFields() {
  const fields = cc.getFields()
  const types = cc.FieldType
  const aggregations = cc.AggregationType

  fields
    .newDimension()
    .setId('circleId')
    .setName('ID')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('circleName')
    .setName('Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('circleFteFilledMemberCount')
    .setName('FTE Filled Member Count')
    .setType(types.NUMBER)
    
  fields
    .newDimension()
    .setId('circleFteValue')
    .setName('FTE Value')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('circleRolesCount')
    .setName('Roles Count')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('circleMembersCount')
    .setName('Members Count')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('circleCreatedAt')
    .setName('Created At')
    .setType(types.YEAR_MONTH_DAY)

  return fields
}

/**
 * Formats a single row of data into the required format.
 *
 * @param {Object} requestedFields Fields requested in the getData request.
 * @param {Object} circle
 * @returns {Object} Contains values for requested fields in predefined format.
 */
function formatCircleData(requestedFieldsArray, circle) {
  const row = requestedFieldsArray.map(function(requestedField) {
    switch (requestedField.getId()) {
      case 'circleId':
        return circle.id
      case 'circleName':
        return circle.name
      case 'circleFteFilledMemberCount':
        return circle.timeSpent.FTEFilledMemberCount
      case 'circleFteValue':
        return circle.timeSpent.FTEValue
      case 'circleRolesCount':
        return circle.rolesCount
      case 'circleMembersCount':
        return circle.membersCount
      case 'circleCreatedAt':
        if (circle.createdAt === null) {
          return null
        }
        return moment(circle.createdAt).format("YYYYMMDD") 
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
 * @param {Object} circles The circles object
 * @param {Array} requestedFields The fields requested in the getData request.
 * @returns {Array} Array containing rows of data in key-value pairs for each
 *     field.
 */
function getFormattedCirclesData(circles, requestedFields) {
  const requestedFieldsArray = requestedFields.asArray()
  const formattedCircles = circles.map((circle) => {
    return formatCircleData(requestedFieldsArray, circle)
  })
  return formattedCircles
}