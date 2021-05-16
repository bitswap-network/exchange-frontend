import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ChakraHome from './pages/ChakraHome'
import ChakraDemo from './pages/ChakraDemo'
import { StoryBook } from './pages/StoryBook'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Wallet } from './pages/Wallet'
import { bitswapTheme } from './theme'
import { Playground } from './pages/Playground'

export const App = (): React.ReactElement => (
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
)
