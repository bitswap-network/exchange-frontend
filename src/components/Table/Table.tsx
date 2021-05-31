/* eslint-disable react/jsx-key */
// jsx-key is disabled because it fails to apply to the spread operator with typed object [as of May 2021]

import React, { PropsWithChildren, useState, useEffect } from "react"
import {
    Table as ChakraTable,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    chakra,
    useDisclosure,
} from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, TableOptions } from "react-table"
import { OrderInfoModal } from "../OrderInfoModal"
import { OrderTableDataInterface } from "../../interfaces/Order"

export function Table<T extends Record<string, unknown>>({
    data,
    columns,
    type,
}: PropsWithChildren<TableOptions<T>>): React.ReactElement {
    const [selectOrder, setSelectOrder] = useState<OrderTableDataInterface>()
    const isOrderTable = type === 0
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable<T>({ columns, data }, useSortBy)
    const modalDisclosure = useDisclosure()
    return (
        <>
            {isOrderTable && (
                <OrderInfoModal
                    disclosure={modalDisclosure}
                    order={selectOrder}
                />
            )}
            <ChakraTable
                {...getTableProps()}
                size="sm"
                variant="simple"
                borderRadius="md"
            >
                <Thead minH={isOrderTable && "100"}>
                    {headerGroups.map((headerGroup) => (
                        <Tr
                            {...headerGroup.getHeaderGroupProps()}
                            key={Math.random().toString(4)}
                        >
                            {headerGroup.headers.map((column) => (
                                <Th
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                    isNumeric={column.isNumeric}
                                    pt="4"
                                    pb="4"
                                >
                                    {column.render("Header")}
                                    <chakra.span>
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <TriangleDownIcon aria-label="sorted descending" />
                                            ) : (
                                                <TriangleUpIcon aria-label="sorted ascending" />
                                            )
                                        ) : (
                                            <TriangleDownIcon
                                                aria-label="not sorted"
                                                fillOpacity="0"
                                            />
                                        )}
                                    </chakra.span>
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row)
                        return (
                            <Tr
                                {...row.getRowProps()}
                                key={Math.random().toString(4)}
                                onClick={() => {
                                    if (isOrderTable) {
                                        setSelectOrder(
                                            row.original as OrderTableDataInterface
                                        )
                                        modalDisclosure.onOpen()
                                    }
                                }}
                                _hover={{
                                    backgroundColor: "background.primary",
                                    cursor: isOrderTable && "pointer",
                                }}
                            >
                                {row.cells.map((cell) => (
                                    <Td
                                        color="gray.500"
                                        {...cell.getCellProps()}
                                        isNumeric={cell.column.isNumeric}
                                    >
                                        {cell.render("Cell")}
                                    </Td>
                                ))}
                            </Tr>
                        )
                    })}
                </Tbody>
            </ChakraTable>
        </>
    )
}
