import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { loggedInState } from '../../store'
import { useRecoilValue } from 'recoil'

type PrivateRouteProps = {
    authenticationPath?: string
} & RouteProps

export function PrivateRoute({
    authenticationPath,
    ...routeProps
}: PrivateRouteProps) {
    const isLoggedIn = useRecoilValue(loggedInState)
    const redirectPath = authenticationPath ? authenticationPath : '/login'
    if (isLoggedIn) {
        return <Route {...routeProps} />
    } else {
        return <Redirect to={{ pathname: redirectPath }} />
    }
}
