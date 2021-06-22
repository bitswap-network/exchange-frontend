const Tabs = {
    // The parts of the component
    parts: ["tablist", "tab"],
    // The base styles for each part
    baseStyle: {},
    // The size styles for each part
    sizes: {},
    // The variant styles for each part
    variants: {
        order: {
            tablist: {
                border: "1px",
                borderColor: "gray.200",
                bg: "white",
                boxShadow: "sm",
                borderRadius: "sm",
            },
            tab: {
                borderRadius: "sm",
                fontWeight: "semibold",
                color: "gray.300",
                _selected: {
                    border: "2px",
                    borderColor: "blue.300",
                    color: "gray.800",
                },
            },
        },
    },
    // The default `size` or `variant` values
    defaultProps: {},
};

export default Tabs;
