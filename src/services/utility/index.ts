import { client } from "../index";

export const getEthUSD = async () => {
    return await client.get("/utility/eth-usd");
};
export const getBitcloutUSD = async () => {
    return await client.get("/utility/bitclout-usd");
};

export const getOrderHistory = async () => {
    return await client.get("/utility/order-history");
};
