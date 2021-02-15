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
    .setId('name')
    .setName('Name')
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
    .setId('rolesCount')
    .setName('Roles Count')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('membersCount')
    .setName('Members Count')
    .setType(types.NUMBER)

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
 * @param {Object} circle
 * @returns {Object} Contains values for requested fields in predefined format.
 */
function formatCircleData(requestedFieldsArray, circle) {
  const row = requestedFieldsArray.map(function(requestedField) {
    switch (requestedField.getId()) {
      case 'circleId':
        return circle.id
      case 'name':
        return circle.name
      case 'fteFilledMemberCount':
        return circle.timeSpent.FTEFilledMemberCount
      case 'fteValue':
        return circle.timeSpent.FTEValue
      case 'rolesCount':
        return circle.rolesCount
      case 'membersCount':
        return circle.membersCount
      case 'createdAt':
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