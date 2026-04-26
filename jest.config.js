module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-redux|@reduxjs|redux-persist|immer|@react-native|react-native|@react-navigation|@notifee|@react-native-async-storage)/)",
  ],
  moduleNameMapper: {
    "^react-native$": "<rootDir>/__mocks__/react-native.js",
  },
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};