const config = {
  globalSetup: "./tests/core/setup.js",
  globalTeardown: "./tests/core/teardown.js",
  globals: {
    apiUrl: "http://localhost:3001",
  },
};

module.exports = config;
