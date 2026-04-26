module.exports = {
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({ navigate: () => { } }),
    useRoute: () => ({ params: {} }),
    createNavigationContainerRef: () => ({
        current: null,
        navigate: () => { },
        goBack: () => { },
        reset: () => { },
    }),
};
