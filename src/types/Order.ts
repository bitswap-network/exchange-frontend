export enum OrderType {
    Buy = "buy",
    Sell = "sell",
}

export type Order = {
    id: number
    type: OrderType
    quantity: number
    price: number
    date_posted: string
    date_fullfiled: string
    status: string
}
