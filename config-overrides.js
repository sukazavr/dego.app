module.exports = function override(config) {
  config.resolve.mainFields = ['browser', 'main'];
  return config;
};
