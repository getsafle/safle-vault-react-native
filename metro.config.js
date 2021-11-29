let extraMods = require('node-libs-react-native');

const mods = {
  ...extraMods,
  crypto: require.resolve('react-native-crypto')
}

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: mods
  },
};
