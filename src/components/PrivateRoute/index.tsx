import React, { useEffect } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { loggedInState, userState } from "../../store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getUserData } from "../../services/user";
import { logout } from "../../helpers/persistence";

type PrivateRouteProps = RouteProps;

export function PrivateRoute({ ...routeProps }: PrivateRouteProps) {
    const isLoggedIn = useRecoilValue(loggedInState);
    const setUser = useSetRecoilState(userState);
    useEffect(() => {
        getUserData()
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                logout();
            });
    }, []);

    const redirectPath = "/login";
    if (isLoggedIn) {
        return <Route {...routeProps} />;
    } else {
        return <Redirect to={{ pathname: redirectPath }} />;
    }
}
