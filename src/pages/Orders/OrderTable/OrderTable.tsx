import React from "react"
import { Box } from "@chakra-ui/react"
import { Table } from "../../../components/Table"
import { Order } from "../../../interfaces/Order"
import { Column } from "react-table"

interface OrderTableProps {
    data: Order[]
    columns: Column<Order>[]
}

export function OrderTableFunc({
    data,
    columns,
}: OrderTableProps): React.ReactElement {
    return (
        <Box bg="white" maxW="full" w="full" borderRadius="lg" boxShadow="lg">
            <Table data={data} columns={columns} />
        </Box>
    )
}
export const OrderTable = React.memo(OrderTableFunc)
