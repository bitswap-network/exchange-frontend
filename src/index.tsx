import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import TagManager from "react-gtm-module";
import { App } from "./App";
import { bitswapTheme } from "./theme";
import * as config from "./globalVars";

const tagManagerArgs = {
    gtmId: "GTM-WQ8F6D8",
};
!config.isTest && TagManager.initialize(tagManagerArgs);
ReactDOM.render(
    <React.StrictMode>
        <ColorModeScript initialColorMode={bitswapTheme.config.initialColorMode} />
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
