/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { NavBar } from '../../components/NavBar'

export function Home() {
    return (
        <div>
            <NavBar loggedOut />
        </div>
    )
}
