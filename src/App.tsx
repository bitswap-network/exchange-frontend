import * as React from "react";
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ChakraHome from "./pages/ChakraHome";
import ChakraDemo from "./pages/ChakraDemo";

export const App = () => (
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
);
