const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// Watch sibling artifact's data folder so Metro hot-reloads on data changes
config.watchFolders = [
  ...(config.watchFolders ?? []),
  path.resolve(projectRoot, '../ilma/src/data'),
];

module.exports = config;
