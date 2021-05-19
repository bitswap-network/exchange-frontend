import { extendTheme } from '@chakra-ui/react'
import Button from './components/Button'
import Link from './components/Link'
import Tabs from './components/Tabs'

export const bitswapTheme = extendTheme({
    styles: {
        global: {
            body: {
                color: 'black',
            },
        },
    },

    fonts: {
        body: 'Inter, system-ui, sans-serif',
        heading: 'Inter, system-ui, sans-serif',
    },
    colors: {
        brand: {
            100: '#2e6ded',
            200: '#204cab',
            error: '#C70E0E',
        },
        background: {
            primary: '#faf9f8',
            secondary: '#262626',
            login: '#e5e5e5',
        },
    },

    components: {
        Button,
        Link,
        Tabs,
    },
})
