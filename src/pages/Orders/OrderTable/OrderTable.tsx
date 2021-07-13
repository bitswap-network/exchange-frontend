import React from "react";
import { Box } from "@chakra-ui/react";
import { Table } from "../../../components/Table";
import { OrderTableDataInterface } from "../../../interfaces/Order";
import { Column } from "react-table";
import "./scrollbar.css";

interface OrderTableProps {
    data: OrderTableDataInterface[];
    columns: Column<OrderTableDataInterface>[];
    filter?: string;
}

function OrderTableFunc({ data, columns, filter }: OrderTableProps): React.ReactElement {
    return (
        <Box bg="white" maxW="full" w="full" boxShadow="md" borderRadius="6" maxH="700px" overflowY="auto">
            <Table<OrderTableDataInterface> filter={filter} data={data} columns={columns} type={0} />
        </Box>
    );
}
export const OrderTable = React.memo(OrderTableFunc);

function OrderBookTableFunc({ data, columns }: OrderTableProps): React.ReactElement {
    return (
        <Box bg="white" maxW="full" w="full" boxShadow="md" borderRadius="5" maxH="250px" overflowY="auto">
            <Table<OrderTableDataInterface> data={data} columns={columns} type={1} />
        </Box>
    );
}
export const OrderBookTable = React.memo(OrderBookTableFunc);
