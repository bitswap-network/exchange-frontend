export enum OrderType {
    Buy = 'buy',
    Sell = 'sell',
}

export type Order = {
    id: number
    type: OrderType
    quantity: number
    price: number
}
