const Link = {
    variants: {
        default: {
            bg: 'brand.100',
            _hover: {
                textDecoration: 'none',
                bg: 'brand.200',
            },
            color: 'black',
            rounded: 'md',
        },
    },
    defaultProps: {
        variant: 'default',
    },
}

export default Link
