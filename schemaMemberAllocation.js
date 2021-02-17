function getMemberAllocationFields() {
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
    .setId('organizationDaysPerMonth')
    .setName('Organization Days Per Month')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('memberId')
    .setName('Member ID')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberEmail')
    .setName('Member Email')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberDisplayName')
    .setName('Member Display Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberFirstName')
    .setName('Member First Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberLastName')
    .setName('Member Last Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberLocation')
    .setName('Member Location')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('memberCreatedAt')
    .setName('Member Created At')
    .setType(types.YEAR_MONTH_DAY)

  fields
    .newDimension()
    .setId('memberLastLoginAt')
    .setName('Member Last Login At')
    .setType(types.YEAR_MONTH_DAY)

  fields
    .newDimension()
    .setId('circleId')
    .setName('Circle ID')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('circleName')
    .setName('Circle Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('circleFteFilledMemberCount')
    .setName('Circle FTE Filled Member Count')
    .setType(types.NUMBER)
    
  fields
    .newDimension()
    .setId('circleFteValue')
    .setName('Circle FTE Value')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('roleId')
    .setName('Role ID')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('roleName')
    .setName('Role Name')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('rolePurpose')
    .setName('Role Purpose')
    .setType(types.TEXT)

  fields
    .newDimension()
    .setId('roleFteFilledMemberCount')
    .setName('Role FTE Filled Member Count')
    .setType(types.NUMBER)
    
  fields
    .newDimension()
    .setId('roleFteValue')
    .setName('Role FTE Value')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('memberRoleCoreMember')
    .setName('Member-Role Core Member')
    .setType(types.BOOLEAN)

  fields
    .newDimension()
    .setId('memberFte')
    .setName('Member FTE')
    .setType(types.NUMBER)
    
  fields
    .newDimension()
    .setId('memberRoleFteValue')
    .setName('Member-Role FTE Value')
    .setType(types.NUMBER)

  fields
    .newDimension()
    .setId('memberRoleAssignedUntil')
    .setName('Member-Role Assigned Until')
    .setType(types.YEAR_MONTH_DAY)

  return fields
}

/**
 * Formats a single row of data into the required format.
 *
 * @param {Object} requestedFields Fields requested in the getData request.
 * @param {Object} memberAllocation
 * @returns {Object} Contains values for requested fields in predefined format.
 */
function formatMemberAllocationData(requestedFieldsArray, memberAllocation) {
  const row = requestedFieldsArray.map(function(requestedField) {
    switch (requestedField.getId()) {
      case 'memberRoleAssignmentId':
        return memberAllocation.id
      case 'organizationDaysPerMonth':
        return memberAllocation.organization.effortConfiguration.daysPerMonth
      case 'memberId':
        return memberAllocation.member.id
      case 'memberDisplayName':
        return memberAllocation.member.displayName
      case 'memberFirstName':
        return memberAllocation.member.firstName
      case 'memberLastName':
        return memberAllocation.member.lastName
      case 'memberEmail':
        return memberAllocation.member.email
      case 'memberLocation':
        if (memberAllocation.member.customFields.hasOwnProperty('1Location')) {
          return memberAllocation.member.customFields['1Location'].value
        } else {
          return ""
        }
      case 'memberCreatedAt':
        if (memberAllocation.member.createdAt === null) {
          return null
        }
        return moment(memberAllocation.member.createdAt).format("YYYYMMDD") 
      case 'memberLastLoginAt':
        if (memberAllocation.member.lastLoginAt === null) {
          return null
        }
        return moment(memberAllocation.member.lastLoginAt).format("YYYYMMDD") 
      case 'circleId':
        if (memberAllocation.circle) {
          return memberAllocation.circle.id
        } else {
          return ""
        }
      case 'circleName':
        if (memberAllocation.circle) {
          return memberAllocation.circle.name
        } else {
          return ""
        }
      case 'circleFteFilledMemberCount':
        if (memberAllocation.circle) {
          return memberAllocation.circle.timeSpent.FTEFilledMemberCount
        } else {
          return null
        }
      case 'circleFteValue':
        if (memberAllocation.circle) {
          return memberAllocation.circle.timeSpent.FTEValue
        } else {
          return null
        }
      case 'roleId':
        if (memberAllocation.role) {
          return memberAllocation.role.id
        } else {
          return ""
        }
      case 'roleName':
        if (memberAllocation.role) {
          return memberAllocation.role.name
        } else {
          return ""
        }
      case 'rolePurpose':
        if (memberAllocation.role) {
          return memberAllocation.role.purpose
        } else {
          return ""
        }
      case 'roleFteFilledMemberCount':
        if (memberAllocation.role) {
          return memberAllocation.role.timeSpent.FTEFilledMemberCount
        } else {
          return null
        }
      case 'roleFteValue':
        if (memberAllocation.role) {
          return memberAllocation.role.timeSpent.FTEValue
        } else {
          return null
        }
      case 'memberRoleCoreMember':
        return memberAllocation.coreMember
      case 'memberFte':
        return memberAllocation.timeSpent.FTEOfMember
      case 'memberRoleFteValue':
        return memberAllocation.timeSpent.FTEValue
      case 'memberRoleAssignedUntil':
        if (memberAllocation.assignedUntil === null) {
          return null
        }
        return moment(memberAllocation.assignedUntil).format("YYYYMMDD") 
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
 * @param {Object} memberRoleAllocations The memberRoleAllocations object
 * @param {Array} requestedFields The fields requested in the getData request.
 * @returns {Array} Array containing rows of data in key-value pairs for each
 *     field.
 */
function getFormattedMemberAllocationsData(memberAllocations, requestedFields) {
  const requestedFieldsArray = requestedFields.asArray()
  const formattedMemberAllocations = memberAllocations.map((memberAllocation) => { 
    return formatMemberAllocationData(requestedFieldsArray, memberAllocation)
  })
  return formattedMemberAllocations
}


function __testGetFormattedMemberAllocationsData() {
  const m = __testFetchMemberAllocations()

  class fields {
    constructor(fieldName) {
      this.fieldName = fieldName
    }

    getId() {
      return this.fieldName
    }
  }

  const gm = m.filter((member) => {
    return member.member.lastName === 'Tseggai'
  })

  gm.forEach((member) => {
     console.log(member)
  })

  const d = getFormattedMemberAllocationsData(gm, {asArray: () =>{return [
    new fields('memberRoleAssignmentId'),
    new fields('memberId'),
    new fields('memberDisplayName'),
    new fields('memberFirstName'),
    new fields('memberLastName'),
    new fields('memberLocation'),
    new fields('circleId'),
    new fields('circleName'),
    new fields('circleFteFilledMemberCount'),
    new fields('circleFteValue'),
    new fields('roleId'),
    new fields('roleName'),
    new fields('rolePurpose'),
    new fields('roleFteFilledMemberCount'),
    new fields('roleFteValue'),
    new fields('memberRoleCoreMember'),
    new fields('memberFte'),
    new fields('memberRoleFteValue'),
    new fields('memberRoleAssignedUntil')
  ]}})

  console.log(d)
}