import {ColorModeScript} from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import TagManager from "react-gtm-module";
import {App} from "./App";
import * as serviceWorker from "./serviceWorker";
import {bitswapTheme} from "./theme";
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// interface sendToGoogleInterface {
//     name: string
//     delta: number
//     id: string
// }
// function sendToGoogleAnalytics({ name, delta, id }: sendToGoogleInterface) {
//     window.gtag("event", name, {
//         value: Math.round(name === "CLS" ? delta * 1000 : delta),
//         eventCategory: "coreWebVitals",
//         id: id,
//         delta: delta,
//         non_interaction: true, // avoids affecting bounce rate
//     })
// }
// reportWebVitals()
