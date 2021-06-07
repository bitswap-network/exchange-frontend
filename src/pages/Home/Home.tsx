/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"

import {
    Flex,
    Heading,
    Spacer,
    VStack,
    Box,
    Tooltip,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    HStack,
} from "@chakra-ui/react"
import { AiFillInfoCircle } from "react-icons/ai"

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
                    <HStack>
                        <Heading as="h2" size="md">
                            BitClout Market Price
                        </Heading>
                        <Popover placement="right">
                            <PopoverTrigger>
                                <AiFillInfoCircle
                                    style={{
                                        display: "inline",
                                        marginTop: 2,
                                    }}
                                    color="#aaa"
                                />
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader fontSize="sm" fontWeight="600">
                                    Price Derivation
                                </PopoverHeader>
                                <PopoverBody
                                    fontSize="xs"
                                    fontWeight="400"
                                    color="gray.600"
                                >
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Nullam vel justo porttitor,
                                    vestibulum nulla a, elementum nisi. Sed
                                    pulvinar condimentum tincidunt. Nunc vitae
                                    justo sit amet nisi vehicula hendrerit non
                                    pharetra felis. Donec malesuada placerat
                                    mattis. Curabitur tempus mi eget dapibus
                                    rhoncus.
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </HStack>
                    <Flex w="100%" mt="4" mb="2" h="20px" flexDir="row">
                        <Flex
                            bgColor="#dbe6ff"
                            p="4"
                            color="brand.100"
                            fontWeight="500"
                            fontSize="xs"
                            h="20px"
                            align="center"
                            justify="center"
                            borderRadius="4"
                        >
                            Market Buy: $120.23
                        </Flex>
                        <Flex
                            bgColor="#dbe6ff"
                            p="4"
                            color="brand.100"
                            fontWeight="500"
                            fontSize="xs"
                            h="20px"
                            align="center"
                            justify="center"
                            borderRadius="4"
                            ml="4"
                        >
                            Market Sell: $60.24
                        </Flex>
                    </Flex>
                    <Box
                        boxShadow="lg"
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
