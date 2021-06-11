/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react"

import {
    Flex,
    Heading,
    Spacer,
    VStack,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    HStack,
} from "@chakra-ui/react"
import { AiFillInfoCircle } from "react-icons/ai"

import { Column } from "react-table"
import { OrderBookTableColumns, OrderTableDataInterface } from "../../interfaces/Order"
import { OrderBookTable } from "../Orders/OrderTable"
import { useOrderBook } from "../../hooks"

import { Chart } from "../../components/BitCloutChart/Chart"
import { getMarketPrice } from "../../services/order"

import * as globalVars from "../../globalVars"

export function Home(): React.ReactElement {
    const { orderbook, orderbookIsLoading, orderbookIsError } = useOrderBook()
    const [marketBuy, setMarketBuy] = useState<number | null>(null)
    const [marketSell, setMarketSell] = useState<number | null>(null)
    const columns = React.useMemo(() => OrderBookTableColumns, []) as Column<OrderTableDataInterface>[]
    useEffect(() => {
        getMarketPrice(0.05, "buy").then((response) => {
            setMarketBuy(response.data.price * 20)
        })
        getMarketPrice(0.05, "sell").then((response) => {
            setMarketSell(response.data.price * 20)
        })
    })
    return (
        // <>
        <VStack spacing={8} marginTop="40px">
            <Flex flexDirection="row" w="100%">
                <Flex flexDirection="column" w="50%" padding={4}>
                    <Heading>BitSwap</Heading>
                    <HStack>
                        <Heading as="h2" size="md">
                            BitClout Market Value
                        </Heading>
                        <Popover placement="top-start" trigger="hover">
                            <PopoverTrigger>
                                <div>
                                    <AiFillInfoCircle
                                        style={{
                                            display: "inline",
                                            marginBottom: "2",
                                        }}
                                        color="#aaa"
                                    />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverHeader fontSize="sm" fontWeight="600">
                                    Price Derivation
                                </PopoverHeader>
                                <PopoverBody fontSize="xs" fontWeight="400" color="gray.600">
                                    The market bid is the highest current offer to buy CLOUT. The market ask is the
                                    lowest current offer to sell CLOUT.
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                        <Flex
                            bgColor="#dbe6ff"
                            p="4"
                            color="brand.100"
                            fontWeight="500"
                            fontSize="sm"
                            h="20px"
                            align="center"
                            justify="center"
                            borderRadius="4"
                            boxShadow="md"
                            m="4"
                        >
                            Market Ask: {marketBuy ? `$${marketBuy.toFixed(2)}` : " - "}
                        </Flex>
                        <Flex
                            bgColor="#dbe6ff"
                            p="4"
                            color="brand.100"
                            fontWeight="500"
                            fontSize="sm"
                            h="20px"
                            align="center"
                            justify="center"
                            borderRadius="4"
                            boxShadow="md"
                            m="4"
                        >
                            Market Bid: {marketSell ? `$${marketSell.toFixed(2)}` : " - "}
                        </Flex>
                    </HStack>
                    <Box
                        boxShadow="lg"
                        borderRadius="lg"
                        overflow="hidden"
                        bg="white"
                        d="flex"
                        w="100%"
                        pos="relative"
                        mt="4"
                        pl="2"
                        // h="45vh"
                    >
                        <Chart ticks={10} dateTicks={9} />
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
                        data={!orderbookIsLoading && !orderbookIsError ? orderbook!.asks : []}
                        columns={columns}
                    />
                    <Heading as="h2" size="md" mt={4} mb={4}>
                        Buying
                    </Heading>
                    <OrderBookTable
                        data={!orderbookIsLoading && !orderbookIsError ? orderbook!.bids : []}
                        columns={columns}
                    />
                </Flex>
            </Flex>
        </VStack>
        // </>
    )
}
