/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useEffect, useState} from "react";

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
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    Input,
    InputAddon,
    InputGroup,
    InputLeftAddon, InputLeftElement, InputRightAddon, InputRightElement, NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Button
} from "@chakra-ui/react";
import {AiFillInfoCircle} from "react-icons/ai";
import {useUser} from "../../hooks";
import {Column} from "react-table";
import {OrderBookTableColumns, OrderTableDataInterface} from "../../interfaces/Order";
import {OrderBookTable} from "../Orders/OrderTable";
import {useOrderBook} from "../../hooks";
import {useRecoilState, useRecoilValue} from "recoil";
import {Chart} from "../../components/BitCloutChart/Chart";
import {getMarketPrice} from "../../services/order";
import {tokenState} from "../../store";
import {MdLoop} from "react-icons/md"
import * as globalVars from "../../globalVars";
import {BlueButton} from "../../components/BlueButton";

export function Home(): React.ReactElement {
    const {orderbook, orderbookIsLoading, orderbookIsError} = useOrderBook();
    const token = useRecoilValue(tokenState);
    const {user, userIsLoading, userIsError} = useUser(token);
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
            flexDirection={{base: "column", sm: "column", md: "row"}}
            w={{base: "100%", md: "95%"}}
            p={4}
            spacing={0}
            justify={{base: "start", md: "space-between"}}
        >
            <Flex flexDirection="column" w={{base: "100%", md: "55%"}} padding={4}>
                <Heading fontSize={{base: "32px", md: "52px"}} mb={4}>
                    Buy and Sell BitClout for Ethereum
                </Heading>
                <Heading fontSize="18px" color="#696F79" fontWeight="medium" lineHeight="8">
                    BitSwap is the easiest and fastest way to buy and sell BitClout. Join the world&apos;s first BitClout exchange and start trading today!
                </Heading>

                <Box boxShadow="2xl" borderRadius="lg" overflow="hidden" bg="white" p="2" mt="4" borderWidth="2px" borderColor="#DDE2E5">
                    <HStack justify="space-evenly">
                        <Text>
                            <Image src={globalVars.BITCLOUT_LOGO} htmlWidth="32" style={{display: "inline"}} />{" "}
                            {user ? +user.balance.bitclout.toFixed(2) : "-"} CLOUT
                        </Text>
                        <Text>
                            <Image src={globalVars.ETHER_LOGO} htmlWidth="30" style={{display: "inline"}} /> {user ? +user.balance.ether.toFixed(2) : "-"}{" "}
                            ETHER
                        </Text>
                    </HStack>
                </Box>
                <Box boxShadow="2xl" borderRadius="lg" overflow="hidden" bg="white" p="2" mt="4" borderWidth="2px" borderColor="#DDE2E5">
                    <HStack w="full" justify="space-evenly" mt="2" display={{base: "none", md: "flex"}}>
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
            <Flex flexDirection="column" w={{base: "100%", md: "45%"}} padding={4} justify="">
                <Box w="80%" bg="yellow" >
                    <Text color="red">this component is under construction</Text>
                    <VStack w="full" >
                        <HStack w="full" justify="space-evenly" textAlign="center" fontSize="24" fontWeight="bold">
                            <Box bg="#FAFAFA" w="full" >
                                <Text color="#2E6DED">Buy</Text>
                            </Box>
                            <Box w="full" >
                                <Text>Sell</Text>
                            </Box>
                        </HStack>
                        <Text fontSize="16" fontWeight="bold">
                            Instantly buy CLOUT at the best price.
                        </Text>
                        <VStack p="2" >
                            <Box p="4" borderWidth="2px" borderColor="#DDE2E5" borderRadius="10" py="2">
                                <Text color="#81868C" fontSize="20px" fontWeight="regular">From</Text>
                                <InputGroup>
                                    <Input type="number" placeholder="6.90" fontSize="48px" height="68px" borderWidth="0px" pl="2" colorScheme="gray" />
                                    <InputRightElement bg="#F9FBFF" w="max" h="40px" borderRadius="6" borderWidth="1px" borderColor="#F3F3F3" p="1" top="unset" bottom="0px">
                                        <HStack w="full"  >
                                            <Image src={globalVars.ETHER_LOGO} boxSize="20px" />
                                            <Text color="#495057" fontSize="20px" pr="2px">ETH</Text>
                                        </HStack>
                                    </InputRightElement>
                                </InputGroup>
                            </Box>
                            <Box bg="white" borderRadius="5" boxSize="41px" borderWidth="2px" borderColor="#DDE2E5" mt="-4" zIndex="overlay" d="flex">
                                <MdLoop color="#7E91BA" size="31px" style={{margin: "auto"}} />
                            </Box>
                            <Box py="2" p="4" borderWidth="2px" borderColor="#DDE2E5" borderRadius="10" mt="-4">
                                <Text color="#81868C" fontSize="20px" fontWeight="regular">To</Text>
                                <InputGroup>
                                    <Input type="number" placeholder="420" fontSize="48px" height="68px" borderWidth="0px" pl="2" colorScheme="gray" />
                                    <InputRightElement bg="#F9FBFF" w="max" h="40px" borderRadius="6" borderWidth="1px" borderColor="#F3F3F3" p="1" top="unset" bottom="0px">
                                        <HStack w="full"  >
                                            <Image src={globalVars.BITCLOUT_LOGO} boxSize="20px" />
                                            <Text color="#495057" fontSize="20px" pr="2px">CLOUT</Text>
                                        </HStack>
                                    </InputRightElement>
                                </InputGroup>
                            </Box>
                        </VStack>
                        <HStack w="full" justify="space-between" px="3" color="#81868C">
                            <Text fontSize="14px" >
                                Exchange Rate:
                            </Text>
                            <Text fontSize="14px" fontWeight="bold">1 ETH ~ 60.969 CLOUT</Text>
                        </HStack>
                        <HStack w="full" justify="space-between" px="3" color="#81868C">
                            <Text fontSize="14px" >
                                Est. Fees:
                            </Text>
                            <Text fontSize="14px" fontWeight="bold">0.0069 ETH</Text>
                        </HStack>
                        <VStack p="2" w="full">
                            <BlueButton text={"Swap"} w="full" size="lg" />
                            <Text as={Button} color="#81868C">
                                Advanced Options
                            </Text>

                        </VStack>

                    </VStack>
                </Box>
                {/* <Image src="./home_placeholder.png" fit="cover" htmlWidth="100%" /> */}
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
