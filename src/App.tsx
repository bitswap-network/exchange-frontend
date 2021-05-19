import * as React from 'react'
import { Box, Container, ChakraProvider, Grid } from '@chakra-ui/react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { StoryBook } from './pages/StoryBook'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Wallet } from './pages/Wallet'
import { bitswapTheme } from './theme'
<<<<<<< HEAD
import { NavBar } from './components/NavBar'
import { Orders } from './pages/Orders/Orders'
import { Wallet } from './pages/Wallet'
import { Profile } from './pages/Profile'
=======
import { Playground } from './pages/Playground'
>>>>>>> c86e104 (Add Login to NavBar)

export const App = (): React.ReactElement => (
<<<<<<< HEAD
    <RecoilRoot>
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
    </RecoilRoot>
=======
    <ChakraProvider theme={bitswapTheme}>
        <BrowserRouter>
            <Switch>
                {/* TODO: delete storybook, demo, chakrahome, playground */}
                <Route path="/storybook">
                    <StoryBook />
                </Route>
                <Route path="/playground">
                    <Playground />
                </Route>
                <Route exact path="/demo">
                    <ChakraDemo />
                </Route>
                <Route exact path="/chakrahome">
                    <ChakraHome />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/wallet">
                    <Wallet />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </BrowserRouter>
    </ChakraProvider>
>>>>>>> a31581c (Add BalanceCard)
)
