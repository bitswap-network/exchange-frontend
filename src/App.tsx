import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import ChakraHome from './pages/ChakraHome'
import ChakraDemo from './pages/ChakraDemo'
import { StoryBook } from './pages/StoryBook'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Wallet } from './pages/Wallet'
import { bitswapTheme } from './theme'
import { Playground } from './pages/Playground'

export const App = (): React.ReactElement => (
    <RecoilRoot>
        <ChakraProvider theme={bitswapTheme}>
            <BrowserRouter>
                <Switch>
                    <Route path="/storybook">
                        <StoryBook />
                    </Route>
                    <Route exact path="/demo">
                        <ChakraDemo />
                    </Route>
                    <Route path="/">
                        <ChakraHome />
                    </Route>
                </Switch>
            </BrowserRouter>
        </ChakraProvider>
    </RecoilRoot>
)
