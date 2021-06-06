import React, { ReactElement, Suspense } from "react"
import {
    Box,
    Container,
    ChakraProvider,
    Grid,
    Skeleton,
} from "@chakra-ui/react"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import { RecoilRoot } from "recoil"

import { bitswapTheme } from "./theme"

import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Wallet } from "./pages/Wallet"
import { Orders } from "./pages/Orders"
import { Profile } from "./pages/Profile"

import { DefaultNavBar, NavBar } from "./components/NavBar"
import { PrivateRoute } from "./components/PrivateRoute"

import * as config from "./globalVars"
import { identityHandler } from "./services/identity"
import TagManager from "react-gtm-module"

const tagManagerArgs = {
    dataLayer: {
        userId: "001",
        userProject: "project",
        page: "home",
    },
    dataLayerName: "PageDataLayer",
}

window.addEventListener("message", identityHandler)

console.log(process.env)

export const App = (): ReactElement => {
    return (
        <>
            <iframe
                id="identity"
                frameBorder="0"
                src={`${config.identityURL}/embed`}
                style={{
                    height: "100vh",
                    width: "100vw",
                    display: "none",
                }}
            />
            <RecoilRoot>
                <ChakraProvider theme={bitswapTheme} resetCSS>
                    {/* <CSSReset /> */}
                    <BrowserRouter>
                        <Grid h="100vh" templateRows={"64px 1fr"}>
                            {/* TODO: implement auth to set loggedOut */}
                            <Suspense fallback={DefaultNavBar(true)}>
                                <NavBar />
                            </Suspense>

                            <Box p={8} bg={"background.primary"}>
                                <Suspense fallback={<></>}>
                                    <Container maxW="container.xl">
                                        <Switch>
                                            <Route path="/login">
                                                <Login />
                                            </Route>
                                            <PrivateRoute path="/orders">
                                                <Orders />
                                            </PrivateRoute>
                                            <PrivateRoute path="/wallet">
                                                <Wallet />
                                            </PrivateRoute>
                                            <PrivateRoute path="/profile">
                                                <Profile />
                                            </PrivateRoute>
                                            <Route path="/home">
                                                <Redirect to="/" />
                                            </Route>
                                            <Route path="/">
                                                <Home />
                                            </Route>
                                        </Switch>
                                    </Container>
                                </Suspense>
                            </Box>
                        </Grid>
                    </BrowserRouter>
                </ChakraProvider>
            </RecoilRoot>
        </>
    )
}
