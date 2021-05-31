import React from "react"
import { Box } from "@chakra-ui/react"
import { Table } from "../../../components/Table"
import { OrderTableDataInterface } from "../../../interfaces/Order"
import { Column } from "react-table"

interface OrderTableProps {
    data: OrderTableDataInterface[]
    columns: Column<OrderTableDataInterface>[]
}

function OrderTableFunc({
    data,
    columns,
}: OrderTableProps): React.ReactElement {
    return (
        <Box bg="white" maxW="full" w="full" borderRadius="lg" boxShadow="lg">
            <Table<OrderTableDataInterface>
                data={data}
                columns={columns}
                type={0}
            />
        </Box>
    )
}
export const OrderTable = React.memo(OrderTableFunc)

function OrderBookTableFunc({
    data,
    columns,
}: OrderTableProps): React.ReactElement {
    return (
        <Box bg="white" maxW="full" w="full" borderRadius="lg" boxShadow="lg">
            <Table<OrderTableDataInterface>
                data={data}
                columns={columns}
                type={1}
            />
        </Box>
    )
}
export const OrderBookTable = React.memo(OrderBookTableFunc)
