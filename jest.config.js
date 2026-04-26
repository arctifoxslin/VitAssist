module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-redux|@reduxjs|redux-persist|immer)/)",
  ],
  moduleNameMapper: {
    "^react-native$": "<rootDir>/__mocks__/react-native.js",
    "^@notifee/react-native$": "<rootDir>/__mocks__/@notifee/react-native.js",
    "^@react-navigation/native$": "<rootDir>/__mocks__/@react-navigation/native.js",
    "^@react-navigation/native-stack$": "<rootDir>/__mocks__/@react-navigation/native-stack.js",
    "^react-native-vector-icons/(.*)$": "<rootDir>/__mocks__/react-native-vector-icons/$1.js",
  },
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};