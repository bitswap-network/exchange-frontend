import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import Button from "./components/Button";
import Link from "./components/Link";
import Tabs from "./components/Tabs";
import Popover from "./components/Popover";

const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false,
};
export const bitswapTheme = extendTheme({
    config,
    styles: {
        global: {
            "html,body": {
                color: "black",
                lineHeight: "tall",
            },
            ".navlink": {
                transition: "transform 100ms",
                _hover: {
                    transform: "translateY(-2px)",
                },
            },
        },
    },
    fonts: {
        body: "Inter, system-ui, sans-serif",
        heading: "Inter, system-ui, sans-serif",
    },
    colors: {
        brand: {
            100: "#407BFF",
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
            primary: "#F9FBFF",
            secondary: "#262626",
        },
    },
    components: {
        Button,
        Link,
        Tabs,
        Popover,
    },
});
