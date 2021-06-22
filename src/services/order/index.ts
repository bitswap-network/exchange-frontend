import { authClient, client } from "../index";

export const getOrder = async (id: string) => {
    return await authClient.get(`/order/${id}`);
};
export const cancelOrder = async (id: string) => {
    return await authClient.get(`/order/cancel/${id}`);
};
export const createLimitOrder = async (orderQuantity: number, orderPrice: number, orderSide: string) => {
    return await authClient.post(`/order/limit`, {
        orderQuantity: orderQuantity,
        orderPrice: orderPrice,
        orderSide: orderSide,
    });
};
export const createMarketOrder = async (orderQuantity: number, orderSide: string) => {
    return await authClient.post(`/order/market`, {
        orderQuantity: orderQuantity,
        orderSide: orderSide,
    });
};

export const getMarketPrice = async (orderQuantity: number, orderSide: string) => {
    return await client.post(`/order/market-price`, {
        orderQuantity: orderQuantity,
        orderSide: orderSide,
    });
};
