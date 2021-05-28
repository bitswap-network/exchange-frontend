import { client } from "../index"

export const getEthUSD = async () => {
    return await client.get("/utility/eth-usd")
}
export const getBitcloutUSD = async () => {
    return await client.get("/utility/bitclout-usd")
}

export const getDepth = async (startAt: number, endAt: number) => {
    return await client.post("/utility/depth", {
        startAt: startAt,
        endAt: endAt,
    })
}

export const getCurrentDepth = async () => {
    console
    return await client.get("/utility/depth-current")
}
