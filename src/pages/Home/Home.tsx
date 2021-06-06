/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"

import { Flex, Heading, Spacer, VStack, Box } from "@chakra-ui/react"

import { Column } from "react-table"
import {
    OrderBookTableColumns,
    OrderTableDataInterface,
} from "../../interfaces/Order"
import { OrderBookTable } from "../Orders/OrderTable"
import { useOrderBook } from "../../hooks"

import { Chart } from "../../components/BitCloutChart/Chart"

export function Home(): React.ReactElement {
    const { orderbook, orderbookIsLoading, orderbookIsError } = useOrderBook()

    const columns = React.useMemo(
        () => OrderBookTableColumns,
        []
    ) as Column<OrderTableDataInterface>[]

    return (
        // <>
        <VStack spacing={8} marginTop="40px">
            <Flex flexDirection="row" w="100%">
                <Flex flexDirection="column" w="50%" padding={4}>
                    <Heading>Home</Heading>
                    <Heading as="h2" size="md">
                        BitClout Market Price
                    </Heading>

                    <Box
                        boxShadow="xs"
                        borderRadius="lg"
                        overflow="hidden"
                        // bg="white"
                        d="flex"
                        w="100%"
                        pos="relative"
                        marginTop="4"
                        paddingLeft="2"
                    >
                        <Chart ticks={10} />
                    </Box>
                </Flex>
                <Spacer />
                <Flex flexDirection="column" w="50%" padding={4}>
                    <Heading as="h2" size="lg">
                        Order Book
                    </Heading>
                    <Heading as="h2" size="md" mt={4} mb={4}>
                        Selling
                    </Heading>
                    <OrderBookTable
                        data={
                            !orderbookIsLoading && !orderbookIsError
                                ? orderbook!.asks
                                : []
                        }
                        columns={columns}
                    />
                    <Heading as="h2" size="md" mt={4} mb={4}>
                        Buying
                    </Heading>
                    <OrderBookTable
                        data={
                            !orderbookIsLoading && !orderbookIsError
                                ? orderbook!.bids
                                : []
                        }
                        columns={columns}
                    />
                </Flex>
            </Flex>
        </VStack>
        // </>
    )
}
