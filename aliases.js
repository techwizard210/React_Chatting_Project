const aliases = (prefix = `src`) => ({
  "@fuse": `${prefix}/@fuse`,
  "@history": `${prefix}/@history`,
  "@lodash": `${prefix}/@lodash`,
  "@mock-api": `${prefix}/@mock-api`,
  "app/store": `${prefix}/app/store`,
  "app/shared-components": `${prefix}/app/shared-components`,
  "app/configs": `${prefix}/app/configs`,
  "app/theme-layouts": `${prefix}/app/theme-layouts`,
  "app/AppContext": `${prefix}/app/AppContext`,
  "app/auth": `${prefix}/app/auth`,
  "app/services": `${prefix}/app/services`,
  "app/main": `${prefix}/app/main`,
  "app/FoxOrganization": `${prefix}/app/FoxOrganization`,
});

module.exports = aliases;
