export type Order = {
    _id: string
    username: string
    created: Date
    orderID: string
    orderSide: string
    orderType: string
    orderQuantity: number
    orderPrice: number | undefined
    orderQuantityProcessed: number
    complete: boolean
    error: string | undefined
    completeTime: Date | undefined
}
export interface OrderTableDataInterface extends Order {
    tldr: string
    status: string
    quantityString: string
    priceString: string
    orderTypeCapped: string
    createdAgo: string
    completedAgo?: string
}
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
