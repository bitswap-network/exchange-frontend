import React, { ReactElement, Suspense } from "react";
import { Box, Container, ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { RecoilRoot } from "recoil";

import { bitswapTheme } from "./theme";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Orders } from "./pages/Orders";
import { Profile } from "./pages/Profile";

import { DefaultNavBar, NavBar } from "./components/NavBar";
import { PrivateRoute } from "./components/PrivateRoute";

import * as config from "./globalVars";
import { identityHandler } from "./services/identity";

window.addEventListener("message", identityHandler);

if (!localStorage.getItem("nulledState")) {
    console.log("nulling");
    localStorage.clear();
    localStorage.setItem("nulledState", JSON.stringify(true));
}

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
                    <BrowserRouter>
                        {/* TODO: implement auth to set loggedOut */}
                        <Suspense fallback={DefaultNavBar()}>
                            <NavBar />
                        </Suspense>

                        <Box p={{ base: 4, md: 8 }}>
                            <Suspense fallback={<></>}>
                                <Container maxW="container.xl">
                                    <Switch>
                                        <Route path="/login">
                                            <Login />
                                        </Route>
                                        <PrivateRoute path="/orders">
                                            <Orders />
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
                    </BrowserRouter>
                </ChakraProvider>
            </RecoilRoot>
        </>
    );
};
