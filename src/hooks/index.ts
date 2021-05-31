import axios from "axios"
import useSWR from "swr"
import { api } from "../globalVars"

export function useOrderBook() {
    const { data, error } = useSWR(
        `${api}utility/depth-current`,
        (url) =>
            axios.get(url).then((res) => {
                const askArr: orderSideString[] = []
                const bidArr: orderSideString[] = []
                res.data.data.asks.forEach((ask: any) =>
                    askArr.push({
                        totalString: `$${ask.price * ask.quantity} USD`,
                        priceString: `$${ask.price} USD`,
                        quantityString: `${ask.quantity} BCLT`,
                    })
                )
                res.data.data.bids.forEach((bid: any) =>
                    bidArr.push({
                        ...bid,
                        totalString: `$${bid.price * bid.quantity} USD`,
                        priceString: `$${bid.price} USD`,
                        quantityString: `${bid.quantity} BCLT`,
                    })
                )

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
