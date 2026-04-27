module.exports = {
    presets: [
        "module:metro-react-native-babel-preset",
        "@babel/preset-flow"
    ],
    plugins: [
        ["@babel/plugin-transform-export-namespace-from"],
        ["@babel/plugin-transform-modules-commonjs"],
    ],
};