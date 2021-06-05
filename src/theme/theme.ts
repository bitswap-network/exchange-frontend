import { extendTheme } from "@chakra-ui/react"
import Button from "./components/Button"
import Link from "./components/Link"
import Tabs from "./components/Tabs"

export const bitswapTheme = extendTheme({
    styles: {
        global: {
            body: {
                color: "black",
            },
        },
    },
    fonts: {
        body: "Inter, system-ui, sans-serif",
        heading: "Inter, system-ui, sans-serif",
    },
    colors: {
        brand: {
            100: "#2e6ded",
            150: "#2659c7",
            200: "#204cab",
            error: "#C70E0E",
        },
        brandSubtle: {
            100: "#fafcff",
            150: "#F3F7FF",
            200: "#edf3ff",
        },
        background: {
            primary: "#faf9f8",
            secondary: "#262626",
            login: "#e5e5e5",
        },
    },

    components: {
        Button,
        Link,
        Tabs,
    },
})
