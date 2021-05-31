import axios from "axios"
import useSWR from "swr"
import { api } from "../globalVars"

export function useOrderBook() {
    const { data, error } = useSWR(
        `${api}utility/orderbook`,
        (url) =>
            axios.get(url).then((res) => {
                // console.log("hoook", res)
                const askArr: orderSideString[] = []
                const bidArr: orderSideString[] = []
                res.data.asks.forEach((ask: any) =>
                    askArr.push({
                        totalString: `$${ask.price * ask.quantity} USD`,
                        priceString: `$${ask.price} USD`,
                        quantityString: `${ask.quantity} BCLT`,
                    })
                )
                res.data.bids.forEach((bid: any) =>
                    bidArr.push({
                        ...bid,
                        totalString: `$${bid.price * bid.quantity} USD`,
                        priceString: `$${bid.price} USD`,
                        quantityString: `${bid.quantity} BCLT`,
                    })
                )

                // console.log("hook", { asks: askArr, bids: bidArr })

                return { asks: askArr, bids: bidArr }
            }),
        {
            refreshInterval: 5000,
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
        asks: orderSideString[]
        bids: orderSideString[]
    }
    orderbookIsLoading: boolean
    orderbookIsError: any
}

interface orderSideString {
    totalString: string
    priceString: string
    quantityString: string
}
