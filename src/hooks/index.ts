import useSWR from "swr"
import { getCurrentDepth } from "../services/utility"

export function useOrderBook() {
    const { data, error } = useSWR(null, () =>
        getCurrentDepth().then((res) => {
            res.data.asks.forEach(
                (ask: any) => (ask.total = ask.price * ask.quantity)
            )
            res.data.bids.forEach(
                (bid: any) => (bid.total = bid.price * bid.quantity)
            )
            console.log("orderbook", res.data)
            return res.data
        })
    )

    return {
        orderbook: data,
        orderbookIsLoading: !error && !data,
        orderbookIsError: error,
    }
}
