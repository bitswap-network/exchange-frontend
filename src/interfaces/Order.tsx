import React from "react";
import * as globalVars from "../globalVars";

export type Order = {
    _id: string;
    username: string;
    created: Date;
    orderID: string;
    orderSide: string;
    orderType: string;
    etherQuantity: number;
    orderQuantity: number;
    orderPrice: number;
    fees: number | undefined;
    execPrice: number | undefined;
    orderQuantityProcessed: number;
    complete: boolean;
    error: string | undefined;
    completeTime: Date | undefined;
};
export interface OrderTableDataInterface extends Order {
    [index: string]: any;
    tldr: string;
    status: string;
    quantityString: string;
    quantityProcessedString: string;
    priceString: string;
    execPriceString: string;
    orderTypeCapped: string;
    timestamp: Date;
    createdAgo: string;
    completedAgo?: string;
    totalString?: string;
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
];

export const OrderTableColumns = [
    {
        Header: "Order Type",
        accessor: "tldr",
    },
    {
        Header: "Quantity",
        accessor: "quantityString",
    },
    {
        Header: "Processed",
        accessor: "quantityProcessedString",
    },
    {
        Header: "Price",
        accessor: "priceString",
    },
    {
        Header: "Exec Price",
        accessor: "execPriceString",
    },
    {
        Header: "Timestamp",
        accessor: "timestamp",
        sortType: "datetime",
        Cell: function create(props: any) {
            return <span>{globalVars.timeSince(props.value)}</span>;
        },
    },
];
