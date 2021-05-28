const Link = {
    variants: {
        default: {
            _hover: {
                textDecoration: "none",
                bg: "background.100",
            },
            color: "black",
            rounded: "md",
        },
    },
    defaultProps: {
        variant: "default",
    },
}

export default Link
