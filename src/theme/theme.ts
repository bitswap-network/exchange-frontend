import { extendTheme } from '@chakra-ui/react'
import Button from './components/Button'

export const bitswapTheme = extendTheme({
    styles: {
        global: {
            body: {
                color: 'black',
            },
        },
    },

    fonts: {
        body: 'Jost, system-ui, sans-serif',
        heading: 'Jost, system-ui, sans-serif',
    },
    colors: {
        brand: {
            100: '#2e6ded',
            200: '#204cab',
            error: '#C70E0E',
        },
        background: {
            primary: '#FAFAFA',
            secondary: '#262626',
            login: '#e5e5e5',
        },
    },

    components: {
        Button,
    },
})
