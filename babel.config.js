module.exports = function (api) {
  api.cache(true);
  return {
    // presets: ['babel-preset-expo'],
    presets: ["module:babel-preset-expo", "module:react-native-dotenv"],
  };
};
