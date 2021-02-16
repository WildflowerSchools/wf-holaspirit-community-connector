function getConfig() {
  var config = cc.getConfig();

  config
    .newInfo()
    .setId('version')
    .setText(
      "Version - 1.0.25"
    );

  config
    .newSelectSingle()
    .setId('record_type')
    .setName("Record Type")
    .setHelpText("Select the record type to extract from HolaSpirit")
    .addOption(config.newOptionBuilder().setLabel("Members").setValue("members"))
    .addOption(config.newOptionBuilder().setLabel("Circles").setValue("circles"))
    .addOption(config.newOptionBuilder().setLabel("Roles").setValue("roles"))
    .addOption(config.newOptionBuilder().setLabel("Member-Role Assignments").setValue("memberRoleAssignments"))
    .addOption(config.newOptionBuilder().setLabel("Member Allocations").setValue("memberAllocations"))

  return config.build();
}

/**
 * Validates config parameters and provides missing values.
 *
 * @param {Object} configParams Config parameters from `request`.
 * @returns {Object} Updated Config parameters.
 */
function validateConfig(configParams) {
  configParams = configParams || {}
  return configParams;
}
