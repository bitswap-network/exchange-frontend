import * as React from 'react'
import { ChakraProvider, theme } from '@chakra-ui/react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ChakraHome from './pages/ChakraHome'
import ChakraDemo from './pages/ChakraDemo'
import { StoryBook } from './pages/StoryBook'

export const App = (): React.ReactElement => (
    <ChakraProvider theme={theme}>
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
)
