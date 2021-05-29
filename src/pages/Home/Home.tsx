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
import {
    Depth as DepthInterface,
    ChartData as ChartDataInterface,
} from "../../interfaces/Depth"
import ParentSize from "@visx/responsive/lib/components/ParentSize"

export function Home(): React.ReactElement {
    const [depth, setDepth] = useState<ChartDataInterface[]>([])
    const [dateRange, setDateRange] = useState("max")
    const [loading, setLoading] = useState(true)
    const { orderbook, orderbookIsLoading, orderbookIsError } = useOrderBook()

    useEffect(() => {
        getDepth(dateRange).then((depthResponse) => {
            const parsedCopy: ChartDataInterface[] = []
            depthResponse.data.data.forEach((depthItem: DepthInterface) => {
                parsedCopy.push({
                    timestamp: new Date(depthItem.timestamp).toString(),
                    marketSell: depthItem.marketSell as number,
                    marketBuy: depthItem.marketBuy as number,
                })
            })
            console.log("parsed depth", parsedCopy)
            setDepth(parsedCopy)
            setLoading(false)
        })
    }, [dateRange])

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
                            <>
                                <ParentSize>
                                    {({ width, height }) => (
                                        <BitcloutChart
                                            data={depth}
                                            width={width}
                                            height={height}
                                            dateRange={dateRange}
                                        />
                                    )}
                                </ParentSize>
                            </>
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
                                !orderbookIsLoading && !orderbookIsError
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
                                !orderbookIsLoading && !orderbookIsError
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
