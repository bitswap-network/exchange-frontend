/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react'

import { Box, Flex, Heading, Spacer, VStack } from '@chakra-ui/react'
import { BitCloutChart } from '../../components/BitCloutChart'
import { Column } from 'react-table'
import { Order, OrderType } from '../../types/Order'
import { OrderTable } from '../Orders/OrderTable'
import { getDepth } from '../../services/utility'

export function Home(): React.ReactElement {
    const [depth, setDepth] = useState([])

    useEffect(() => {
        getDepth().then((depthResponse) => {
            depthResponse.data.data.forEach((depthItem) => {
                depthItem.timestamp = new Date(depthItem.timestamp)
            })
            console.log('response', depthResponse.data.data)
            setDepth(depthResponse.data.data)
        })
    }, [])

    const data = React.useMemo(
        () => [
            {
                id: 1,
                type: OrderType.Buy,
                quantity: 20,
                price: 12.5,
                total: 20 * 12.5,
            },
            {
                id: 2,
                type: OrderType.Sell,
                quantity: 5,
                price: 12.5,
                total: 5 * 12.5,
            },
            {
                id: 3,
                type: OrderType.Buy,
                quantity: 15,
                price: 12.5,
                total: 15 * 12.5,
            },
        ],
        []
    )

    const columns = React.useMemo(
        () => [
            {
                Header: 'Quantity',
                accessor: 'quantity',
                isNumeric: true,
            },
            {
                Header: 'Price',
                accessor: 'price',
                isNumeric: true,
            },
            {
                Header: 'Total',
                accessor: 'total',
                isNumeric: true,
            },
        ],
        []
    ) as Column<Order>[]
    return (
        <>
            <VStack spacing={8} marginTop="40px">
                <Flex flexDirection="row" w="100%">
                    <Flex flexDirection="column" w="50%" padding={4}>
                        <Heading>Home</Heading>
                        <Heading as="h2" size="md">
                            BitClout Market Value
                        </Heading>
                        <BitCloutChart
                            data={depth}
                            domain={['dataMin', 'dataMax']}
                        />
                    </Flex>
                    <Spacer />
                    <Flex flexDirection="column" w="50%" padding={4}>
                        <Heading as="h2" size="lg">
                            Order Book
                        </Heading>
                        <Heading
                            as="h2"
                            size="md"
                            marginTop={2}
                            marginBottom={4}
                        >
                            Sell Orders
                        </Heading>
                        <OrderTable
                            data={data.filter(
                                (order) => order.type == OrderType.Sell
                            )}
                            columns={columns}
                        />
                        <Heading
                            as="h2"
                            size="md"
                            marginTop={2}
                            marginBottom={4}
                        >
                            Buy Orders
                        </Heading>
                        <OrderTable
                            data={data.filter(
                                (order) => order.type == OrderType.Buy
                            )}
                            columns={columns}
                        />
                    </Flex>
                </Flex>
            </VStack>
        </>
    )
}
