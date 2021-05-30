export interface Order {
    _id: string
    username: string
    created: Date
    orderID: string
    orderSide: string
    orderType: string
    orderQuantity: number
    orderPrice: number | undefined
    orderQuantityProcessed: number | undefined
    complete: boolean
    error: string | undefined
    completeTime: Date | undefined
}
