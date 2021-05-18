import * as React from 'react'
import { Box, Container, ChakraProvider, Grid } from '@chakra-ui/react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import ChakraHome from './pages/ChakraHome'
import ChakraDemo from './pages/ChakraDemo'
import { StoryBook } from './pages/StoryBook'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { bitswapTheme } from './theme'
import { NavBar } from './components/NavBar'
import { Orders } from './pages/Orders/Orders'
import { Wallet } from './pages/Wallet'
import { Profile } from './pages/Profile'

export const App = (): React.ReactElement => (
    <ChakraProvider theme={bitswapTheme}>
        <BrowserRouter>
            <Grid h="100vh" templateRows={'64px 1fr'}>
                {/* TODO: implement auth to set loggedOut */}
                <NavBar loggedOut={false} />
                <Box bg="background.primary" p={8}>
                    <Container centerContent>
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
)
