module.exports = {
    Platform: { OS: "ios" },
    NativeModules: {},
    NativeEventEmitter: function () { },
    StyleSheet: { create: () => ({}) },
    Dimensions: {
        get: () => ({ width: 390, height: 844 }),
    },
};
