import React from 'react'
import {
    Table as ChakraTable,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    chakra,
} from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useSortBy, Column } from 'react-table'

interface Example {
    fromUnit: string
    toUnit: string
    factor: number
}

function Table(): React.ReactElement {
    const data = React.useMemo<Example[]>(
        () => [
            {
                fromUnit: 'inches',
                toUnit: 'millimetres (mm)',
                factor: 25.4,
            },
            {
                fromUnit: 'feet',
                toUnit: 'centimetres (cm)',
                factor: 30.48,
            },
            {
                fromUnit: 'yards',
                toUnit: 'metres (m)',
                factor: 0.91444,
            },
        ],
        []
    )

    const columns = React.useMemo(
        () =>
            [
                {
                    Header: 'To convert',
                    accessor: 'fromUnit',
                },
                {
                    Header: 'Into',
                    accessor: 'toUnit',
                },
                {
                    Header: 'Multiply by',
                    accessor: 'factor',
                    isNumeric: true,
                },
            ] as Column<Example>[],
        []
    )

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable<Example>({ columns, data }, useSortBy)

    return (
        <ChakraTable {...getTableProps()}>
            <Thead>
                {headerGroups.map((headerGroup) => (
                    <Tr
                        key={headerGroup.id}
                        {...headerGroup.getHeaderGroupProps()}
                    >
                        {headerGroup.headers.map((column) => (
                            <Th
                                key={column.id}
                                {...column.getHeaderProps(
                                    column.getSortByToggleProps()
                                )}
                                isNumeric={column.isNumeric}
                            >
                                {column.render('Header')}
                                <chakra.span pl="4">
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <TriangleDownIcon aria-label="sorted descending" />
                                        ) : (
                                            <TriangleUpIcon aria-label="sorted ascending" />
                                        )
                                    ) : null}
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
                        <Tr key={row.id} {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <Td
                                    key={cell}
                                    {...cell.getCellProps()}
                                    isNumeric={cell.column.isNumeric}
                                >
                                    {cell.render('Cell')}
                                </Td>
                            ))}
                        </Tr>
                    )
                })}
            </Tbody>
        </ChakraTable>
    )
}

export default Table
