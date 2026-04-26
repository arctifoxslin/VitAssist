module.exports = {
    createNativeStackNavigator: () => ({
        Navigator: ({ children }) => children,
        Screen: () => null,
    }),
};
