/* eslint-disable react/jsx-key */
// jsx-key is disabled because it fails to apply to the spread operator with typed object [as of May 2021]

import React, { PropsWithChildren, useState } from "react"
import { Table as ChakraTable, Thead, Tbody, Tr, Th, Td, chakra, useDisclosure } from "@chakra-ui/react"
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
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<T>(
        { columns, data, autoResetPage: true },
        useSortBy
    )
    const modalDisclosure = useDisclosure()
    return (
        <>
            {isOrderTable && <OrderInfoModal disclosure={modalDisclosure} order={selectOrder} />}
            <ChakraTable {...getTableProps()} size="sm" variant="simple" borderRadius="md" bgColor="white">
                <Thead position="sticky" top="0" zIndex="100" bgColor="white" minH={isOrderTable ? "100" : "inherit"}>
                    {headerGroups.map((headerGroup) => (
                        <Tr {...headerGroup.getHeaderGroupProps()} key={Math.random().toString(4)}>
                            {headerGroup.headers.map((column) => (
                                <Th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    pt="4"
                                    pb="4"
                                    verticalAlign="top"
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
                                            <TriangleDownIcon aria-label="not sorted" fillOpacity="0" />
                                        )}
                                    </chakra.span>
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {rows.length > 0 ? (
                        <>
                            {rows.map((row) => {
                                prepareRow(row)
                                return (
                                    <Tr
                                        w={100 / rows.length}
                                        {...row.getRowProps()}
                                        key={Math.random().toString(4)}
                                        onClick={() => {
                                            if (isOrderTable) {
                                                setSelectOrder(row.original as OrderTableDataInterface)
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
                                                pt="3"
                                                pb="3"
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
                        </>
                    ) : (
                        <Tr
                            key={Math.random().toString(4)}
                            _hover={{
                                backgroundColor: "background.primary",
                            }}
                            alignContent="center"
                        >
                            <Td pt="3" pb="3" color="gray.500">
                                No orders yet...
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </ChakraTable>
        </>
    )
}
