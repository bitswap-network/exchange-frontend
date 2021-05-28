import React from "react"
import { Box } from "@chakra-ui/react"
import { Table } from "../../../components/Table"
import { Order } from "../../../types/Order"
import { Column } from "react-table"

interface OrderTableProps {
    data: Order[]
    columns: Column<Order>[]
}

export function OrderTable({
    data,
    columns,
}: OrderTableProps): React.ReactElement {
    return (
        <Box bg="white" maxW="full" w="full" borderRadius="lg" boxShadow="xs">
            <Table<Order> data={data} columns={columns} />
        </Box>
    )
}
