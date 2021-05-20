import React, { ReactElement } from 'react'
import { Box, Container, ChakraProvider, Grid } from '@chakra-ui/react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import { bitswapTheme } from './theme'

import { StoryBook } from './pages/StoryBook'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Wallet } from './pages/Wallet'
import { Orders } from './pages/Orders'
import { Profile } from './pages/Profile'

import { NavBar } from './components/NavBar'

import * as config from './config'
import { identityHandler } from './services/identity'

window.addEventListener('message', identityHandler)

export const App = (): ReactElement => (
    <>
        <iframe
            id="identity"
            frameBorder="0"
            src={`${config.identityURL}/embed`}
            style={{
                height: '100vh',
                width: '100vw',
                display: 'none',
            }}
        />
        <RecoilRoot>
            <ChakraProvider theme={bitswapTheme}>
                <BrowserRouter>
                    <Grid h="100vh" templateRows={'64px 1fr'}>
                        {/* TODO: implement auth to set loggedOut */}
                        <NavBar loggedOut={false} />
                        <Box bg="background.primary" p={8}>
                            <Container maxW="container.xl">
                                <Switch>
                                    <Route path="/storybook">
                                        <StoryBook />
                                    </Route>
                                    <Route path="/login">
                                        <Login />
                                    </Route>
                                    <Route path="/orders">
                                        <Orders />
                                    </Route>
                                    <Route path="/wallet">
                                        <Wallet />
                                    </Route>
                                    <Route path="/profile">
                                        <Profile />
                                    </Route>
                                    <Route path="/home">
                                        <Redirect to="/" />
                                    </Route>
                                    <Route path="/">
                                        <Home />
                                    </Route>
                                </Switch>
                            </Container>
                        </Box>
                    </Grid>
                </BrowserRouter>
            </ChakraProvider>
        </RecoilRoot>
    </>
)
