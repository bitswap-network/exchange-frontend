export interface Depth {
    timestamp: Date
    marketBuy: number
    marketSell: number
    asks: { price: number; quantity: number }[]
    bids: { price: number; quantity: number }[]
}