import * as React from 'react'
import { ChakraProvider, theme } from '@chakra-ui/react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import ChakraHome from './pages/ChakraHome'
import ChakraDemo from './pages/ChakraDemo'

export const App = (): React.ReactElement => (
    <RecoilRoot>
        <ChakraProvider theme={theme}>
            <BrowserRouter>
                <Switch>
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
