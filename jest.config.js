export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^.*config/env$": "<rootDir>/src/test/mocks/env.js",
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(png|jpe?g|gif|svg|webp)$": "<rootDir>/src/test/fileMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.js"],
  clearMocks: true,
};
