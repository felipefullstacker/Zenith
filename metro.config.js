const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path aliases and support for all React Native extensions
config.resolver.assetExts.push('cjs');
config.resolver.sourceExts.push('jsx', 'ts', 'tsx', 'js');

// Config path aliases to work with Expo / Metro
const srcDir = path.resolve(__dirname, 'src');

config.resolver.extraNodeModules = {
  '@': srcDir,
  '@config': path.resolve(srcDir, 'config'),
  '@core': path.resolve(srcDir, 'core'),
  '@modules': path.resolve(srcDir, 'modules'),
  '@features': path.resolve(srcDir, 'features'),
  '@ui': path.resolve(srcDir, 'ui'),
  '@hooks': path.resolve(srcDir, 'hooks'),
  '@utils': path.resolve(srcDir, 'utils'),
  '@constants': path.resolve(srcDir, 'constants'),
};

module.exports = config;
