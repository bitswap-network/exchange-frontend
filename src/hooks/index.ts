import axios from "axios"
import useSWR from "swr"
import { api } from "../globalVars"

export function useOrderBook() {
    const { data, error } = useSWR(
        `${api}utility/depth-current`,
        (url) =>
            axios.get(url).then((res) => {
                res.data.data.asks.forEach(
                    (ask: any) => (ask.total = ask.price * ask.quantity)
                )
                res.data.data.bids.forEach(
                    (bid: any) => (bid.total = bid.price * bid.quantity)
                )
                // console.log("orderbook", res.data)
                return res.data.data
            }),
        {
            refreshInterval: 30000,
        }
    )

    return {
        orderbook: data,
        orderbookIsLoading: !error && !data,
        orderbookIsError: error,
    }
}

export interface orderBookInterface {
    orderbook: {
        asks: {
            total: number
            price: number
            quantity: number
        }[]
        bids: {
            total: number
            price: number
            quantity: number
        }[]
    }
    orderbookIsLoading: boolean
    orderbookIsError: any
}
