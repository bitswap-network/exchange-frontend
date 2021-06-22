import axios from "axios";
import useSWR from "swr";
import { api, BITCLOUT } from "../globalVars";
import { OrderTableDataInterface } from "../interfaces/Order";
import * as globalVars from "../globalVars";

export function useOrderBook() {
    const { data, error } = useSWR(
        `${api}utility/orderbook`,
        (url) =>
            axios.get(url).then((res) => {
                // console.log("hoook", res)
                const askArr: orderSideString[] = [];
                const bidArr: orderSideString[] = [];

                res.data.asks &&
                    res.data.asks.reverse().forEach((ask: any) =>
                        askArr.push({
                            totalString: `$${(ask.price * ask.quantity).toFixed(2)} USD`,
                            priceString: `$${ask.price} USD`,
                            quantityString: `${ask.quantity} ${BITCLOUT}`,
                        })
                    );
                res.data.bids &&
                    res.data.bids.forEach((bid: any) =>
                        bidArr.push({
                            ...bid,
                            totalString: `$${(bid.price * bid.quantity).toFixed(2)} USD`,
                            priceString: `$${bid.price} USD`,
                            quantityString: `${bid.quantity} ${BITCLOUT}`,
                        })
                    );
                return { asks: askArr, bids: bidArr };
            }),
        {
            refreshInterval: 10000,
        }
    );

    return {
        orderbook: data,
        orderbookIsLoading: !error && !data,
        orderbookIsError: error,
    };
}

export interface orderBookInterface {
    orderbook: {
        asks: orderSideString[];
        bids: orderSideString[];
    };
    orderbookIsLoading: boolean;
    orderbookIsError: any;
}

interface orderSideString {
    totalString: string;
    priceString: string;
    quantityString: string;
}

export function useUser(token: string) {
    const { data, error } = useSWR(
        token ? `${api}user/data` : null,
        (url) =>
            axios
                .get(url, {
                    headers: {
                        "x-access-token": token,
                    },
                })
                .then((res) => res.data),
        {
            refreshInterval: 10000,
        }
    );
    return {
        user: data,
        userIsLoading: !error && !data,
        userIsError: error,
    };
}

const parseOrderData = (orders: OrderTableDataInterface[]) => {
    const tempOrders: OrderTableDataInterface[] = [];
    if (orders.length > 0) {
        orders.forEach((order: OrderTableDataInterface) => {
            tempOrders.push({
                ...order,
                tldr: `${order.orderType.toUpperCase()} ${order.orderSide.toUpperCase()}`,
                status: `${order.error !== "" ? "Error" : order.complete ? "Closed" : order.orderQuantityProcessed > 0 ? "Partial" : "Active"}`,
                orderTypeCapped: globalVars.capFirst(order.orderType),
                quantityString: `${+order.orderQuantity.toFixed(2)} ${globalVars.BITCLOUT}`,
                quantityProcessedString: `${+order.orderQuantityProcessed.toFixed(2)} ${globalVars.BITCLOUT}`,
                priceString: `${order.orderPrice ? `$${+order.orderPrice.toFixed(2)}` : "-"}`,
                execPriceString: `${order.execPrice ? `$${+order.execPrice.toFixed(2)}` : "-"}`,
                createdAgo: globalVars.timeSince(new Date(order.created)),
                completedAgo: order.completeTime ? globalVars.timeSince(new Date(order.completeTime)) : "-",
                timestamp: order.completeTime ? new Date(order.completeTime) : new Date(order.created),
            });
        });
    }

    return tempOrders;
};

export function useOrders(token: string) {
    const { data, error } = useSWR(
        token ? `${api}user/orders` : null,
        (url) =>
            axios
                .get(url, {
                    headers: {
                        "x-access-token": token,
                    },
                })
                .then((res) => parseOrderData(res.data.data)),
        {
            refreshInterval: 5000,
        }
    );
    return {
        orders: data,
        ordersIsLoading: !error && !data,
        ordersIsError: error,
    };
}
