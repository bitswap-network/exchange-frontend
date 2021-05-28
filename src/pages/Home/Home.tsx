/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react"

import { Flex, Heading, Spacer, VStack } from "@chakra-ui/react"
import { BitcloutChart } from "../../components/BitCloutChart/Chart"
import { Background } from "../../components/BitCloutChart/Background"
import { Column } from "react-table"
import { Order, OrderType } from "../../types/Order"
import { OrderTable } from "../Orders/OrderTable"
import { getDepth } from "../../services/utility"
import { useOrderBook } from "../../hooks"
import Style from "styled-jsx"

export function Home(): React.ReactElement {
    const [depth, setDepth] = useState([])
    const [loading, setLoading] = useState(true)
    const { orderbook, orderbookIsLoading, orderbookIsError } = useOrderBook()

    useEffect(() => {
        getDepth(Date.now() - 1000 * 60 * 60 * 24 * 7, Date.now()).then(
            (depthResponse) => {
                depthResponse.data.data.forEach((depthItem: any) => {
                    depthItem.timestamp = new Date(depthItem.timestamp)
                })
                console.log("response", depthResponse.data.data)
                setDepth(depthResponse.data.data)
                setLoading(false)
            }
        )
    }, [])

    const columns = React.useMemo(
        () => [
            {
                Header: "Quantity",
                accessor: "quantity",
                isNumeric: true,
            },
            {
                Header: "Price",
                accessor: "price",
                isNumeric: true,
            },
            {
                Header: "Total",
                accessor: "total",
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
                        {loading ? null : (
                            <BitcloutChart
                                data={depth}
                                width={500}
                                height={500}
                            />
                        )}
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
                            data={
                                !orderbookIsLoading &&
                                !orderbookIsError &&
                                orderbook.asks
                                    ? orderbook.asks
                                    : []
                            }
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
                            data={
                                !orderbookIsLoading &&
                                !orderbookIsError &&
                                orderbook.bids
                                    ? orderbook.bids
                                    : []
                            }
                            columns={columns}
                        />
                    </Flex>
                </Flex>
            </VStack>
        </>
    )
}
