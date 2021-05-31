import { useEffect, useRef } from "react"

export const api =
    process.env.NODE_ENV === "development"
        ? "https://bitswap-core-api-staging.herokuapp.com/"
        : "https://bitwap-core-api.herokuapp.com/"
export const identityURL = "https://identity.bitclout.com"

export const BITCLOUT = "BCLT"
export const ETHER = "ETH"

export const MAX_LIMIT = 200
export const MIN_LIMIT = 1

const epochs: [string, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
]

export function timeSince(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    const interval = epochs.find((i) => i[1] < seconds)
    const count = interval ? Math.floor(seconds / interval[1]) : null
    return interval && count
        ? `${count} ${interval[0]}${count !== 1 ? "s" : ""} ago`
        : "<1 second ago"
}
// export const timeAgo = (date: Date) => {
//     const ago = new Date(date).getTime()
//     const timeAgoInSeconds = Math.floor((Date.now() - ago) / 1000)
//     const { interval, epoch } = getDuration(timeAgoInSeconds)
//     const suffix = interval === 1 ? "" : "s"
//     return `${interval} ${epoch}${suffix} ago`
// }

export const formatBalanceSmall = (balance: number) => {
    return +balance.toFixed(4)
}
export const formatBalanceLarge = (balance: number) => {
    return +balance.toFixed(6)
}

export const formateDateTime = (date: Date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

export const capFirst = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
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
