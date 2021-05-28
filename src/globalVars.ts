import { useEffect, useRef } from "react"

export const api =
    process.env.NODE_ENV === "development"
        ? "http://localhost:5000/"
        : "https://bitwap-core-api.herokuapp.com/"
export const identityURL = "https://identity.bitclout.com"

export const BITCLOUT = "BCLT"
export const ETHER = "ETH"

export const formatBalanceSmall = (balance: number) => {
    return +balance.toFixed(4)
}
export const formatBalanceLarge = (balance: number) => {
    return +balance.toFixed(6)
}

export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)

    // Remember the latest callback if it changes.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        if (delay === null) {
            return
        }

        const id = setInterval(() => savedCallback.current(), delay)

        return () => clearInterval(id)
    }, [delay])
}
