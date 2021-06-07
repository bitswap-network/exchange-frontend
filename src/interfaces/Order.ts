export type Order = {
    _id: string
    username: string
    created: Date
    orderID: string
    orderSide: string
    orderType: string
    orderQuantity: number
    orderPrice: number | undefined
    execPrice: number | undefined
    orderQuantityProcessed: number
    complete: boolean
    error: string | undefined
    completeTime: Date | undefined
}
export interface OrderTableDataInterface extends Order {
    [index: string]: any
    tldr: string
    status: string
    quantityString: string
    priceString: string
    orderTypeCapped: string
    createdAgo: string
    completedAgo?: string
    totalString?: string
}

export const OrderBookTableColumns = [
    {
        Header: "Price",
        accessor: "priceString",
    },
    {
        Header: "Quantity",
        accessor: "quantityString",
    },
    {
        Header: "Total",
        accessor: "totalString",
    },
]

export const OrderTableColumns = [
    {
        Header: "Order Details",
        accessor: "tldr",
    },
    {
        Header: "Status",
        accessor: "status",
    },
    {
        Header: "Order Type",
        accessor: "orderTypeCapped",
    },
    {
        Header: "Quantity",
        accessor: "quantityString",
    },
    {
        Header: "Price",
        accessor: "priceString",
        isNumeric: true,
    },
    {
        Header: "Created",
        accessor: "createdAgo",
    },
    {
        Header: "Completed",
        accessor: "completedAgo",
    },
]
