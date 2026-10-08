const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Temporary compatibility workaround for Lucide
config.resolver.unstable_enablePackageExports = false;

// Ensure Metro recognizes modern JavaScript modules
if (!config.resolver.sourceExts.includes("mjs")) {
  config.resolver.sourceExts.push("mjs");
}

module.exports = withNativeWind(config, {
  input: "./src/global.css",
});
