import { client } from "../index";

export const getEthUSD = async () => {
    return await client.get("/utility/eth-usd");
};
export const getBitcloutUSD = async () => {
    return await client.get("/utility/bitclout-usd");
};

export const getDepth = async (dateRange: string) => {
    return await client.get(`/utility/depth?dateRange=${dateRange}`);
};

export const getCurrentDepth = async () => {
    return await client.get("/utility/depth-current");
};

export const getOrderHistory = async () => {
    return await client.get("/utility/order-history");
};
