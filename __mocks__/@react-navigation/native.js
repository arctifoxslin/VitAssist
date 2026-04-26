module.exports = {
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({ navigate: () => { } }),
    useRoute: () => ({ params: {} }),
};
