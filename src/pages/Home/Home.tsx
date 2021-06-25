/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";

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
    Text,
    HStack,
    Image,
} from "@chakra-ui/react";
import { AiFillInfoCircle } from "react-icons/ai";
import { useUser } from "../../hooks";
import { Column } from "react-table";
import { OrderBookTableColumns, OrderTableDataInterface } from "../../interfaces/Order";
import { OrderBookTable } from "../Orders/OrderTable";
import { useOrderBook } from "../../hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { Chart } from "../../components/BitCloutChart/Chart";
import { getMarketPrice } from "../../services/order";
import { tokenState } from "../../store";
import * as globalVars from "../../globalVars";

export function Home(): React.ReactElement {
    const { orderbook, orderbookIsLoading, orderbookIsError } = useOrderBook();
    const token = useRecoilValue(tokenState);
    const { user, userIsLoading, userIsError } = useUser(token);
    const [marketBuy, setMarketBuy] = useState<number | null>(null);
    const [marketSell, setMarketSell] = useState<number | null>(null);
    const columns = React.useMemo(() => OrderBookTableColumns, []) as Column<OrderTableDataInterface>[];
    useEffect(() => {
        getMarketPrice(0.05, "buy").then((response) => {
            setMarketBuy(response.data.price * 20);
        });
        getMarketPrice(0.05, "sell").then((response) => {
            setMarketSell(response.data.price * 20);
        });
    });
    return (
        // <VStack >
        <Flex
            flexDirection={{ base: "column", sm: "column", md: "row" }}
            w={{ base: "100%", md: "95%" }}
            p={4}
            spacing={0}
            justify={{ base: "start", md: "space-between" }}
        >
            <Flex flexDirection="column" w={{ base: "100%", md: "55%" }} padding={4}>
                <Heading fontSize={{ base: "32px", md: "52px" }} mb={4}>
                    Buy and Sell BitClout for Ethereum
                </Heading>
                <Heading fontSize="18px" color="#696F79" fontWeight="medium" lineHeight="8">
                    BitSwap is the easiest and fastest way to buy and sell BitClout. Join the world&apos;s first BitClout exchange and start trading today!
                </Heading>

                <Box boxShadow="2xl" borderRadius="lg" overflow="hidden" bg="white" p="2" mt="4" borderWidth="2px" borderColor="#DDE2E5">
                    <HStack justify="space-evenly">
                        <Text>
                            <Image src={globalVars.BITCLOUT_LOGO} htmlWidth="32" style={{ display: "inline" }} />{" "}
                            {user ? +user.balance.bitclout.toFixed(2) : "-"} CLOUT
                        </Text>
                        <Text>
                            <Image src={globalVars.ETHER_LOGO} htmlWidth="30" style={{ display: "inline" }} /> {user ? +user.balance.ether.toFixed(2) : "-"}{" "}
                            ETHER
                        </Text>
                    </HStack>
                </Box>
                <Box boxShadow="2xl" borderRadius="lg" overflow="hidden" bg="white" p="2" mt="4" borderWidth="2px" borderColor="#DDE2E5">
                    <HStack w="full" justify="space-evenly" mt="2" display={{ base: "none", md: "flex" }}>
                        <Flex
                            // bgColor="#dbe6ff"
                            p="4"
                            color="brand.100"
                            fontWeight="500"
                            fontSize="sm"
                            h="20px"
                            align="center"
                            justify="center"
                            borderRadius="4"
                            borderWidth="2px"
                            borderColor="#DDE2E5"
                        >
                            Market Ask: {marketBuy ? `$${marketBuy.toFixed(2)}` : " $170.00 "}
                        </Flex>
                        <Flex>
                            <Popover placement="top-start" trigger="hover">
                                <PopoverTrigger>
                                    <div>
                                        <AiFillInfoCircle color="#2E6DED" />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverHeader fontSize="sm" fontWeight="600">
                                        Price Derivation
                                    </PopoverHeader>
                                    <PopoverBody fontSize="xs" fontWeight="400" color="gray.600">
                                        The market bid is the highest current offer to buy CLOUT. The market ask is the lowest current offer to sell CLOUT.
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </Flex>
                        <Flex
                            // bgColor="#dbe6ff"
                            p="4"
                            color="brand.100"
                            fontWeight="500"
                            fontSize="sm"
                            h="20px"
                            align="center"
                            justify="center"
                            borderRadius="4"
                            borderWidth="2px"
                            borderColor="#DDE2E5"
                        >
                            Market Bid: {marketSell ? `$${marketSell.toFixed(2)}` : " $150.00 "}
                        </Flex>
                    </HStack>
                    <Chart ticks={4} dateTicks={10} />
                </Box>
            </Flex>
            <Spacer />
            <Flex flexDirection="column" w={{ base: "100%", md: "45%" }} padding={4} justify="">
                <Image src="./home_placeholder.png" fit="cover" htmlWidth="100%" />
                {/* <Heading as="h2" size="lg">
                    Order Book
                </Heading>
                <Heading as="h2" size="md" mt={4} mb={4}>
                    Selling
                </Heading>
                <OrderBookTable data={!orderbookIsLoading && !orderbookIsError ? orderbook!.asks : []} columns={columns} />
                <Heading as="h2" size="md" mt={4} mb={4}>
                    Buying
                </Heading>
                <OrderBookTable data={!orderbookIsLoading && !orderbookIsError ? orderbook!.bids : []} columns={columns} /> */}
            </Flex>
        </Flex>
        // </VStack>
    );
}
