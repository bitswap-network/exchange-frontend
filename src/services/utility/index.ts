import { client } from '../index'

export const getEthUSD = async () => {
    return await client.get('/utility/eth-usd')
}
export const getBitcloutUSD = async () => {
    return await client.get('/utility/bitclout-usd')
}
