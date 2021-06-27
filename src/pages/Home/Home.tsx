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
    Link,
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
import {ExternalLinkIcon} from '@chakra-ui/icons'
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

                <Box boxShadow="0px 0px 30px 12px rgba(0,0,0,0.07)" borderRadius="lg" overflow="hidden" bg="white" p="2" mt="4" borderWidth="2px" borderColor="#DDE2E5">
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
                <Box boxShadow="0px 0px 30px 12px rgba(0,0,0,0.07)" borderRadius="lg" overflow="hidden" bg="white" p="2" mt="4" borderWidth="2px" borderColor="#DDE2E5">
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
            <Flex flexDirection="column" w={{base: "100%", md: "45%"}} padding={4} >
                <Box w="90%" >
                    <Text color="red">this component is under construction</Text>
                    <VStack w="full" borderColor="#DDE2E5" borderWidth="2px" borderRadius="6" boxShadow="0px 0px 30px 12px rgba(0,0,0,0.07)" >
                        <HStack spacing={0} borderRadius="inherit" w="full" justify="space-evenly" textAlign="center" fontSize="20" fontWeight="bold">
                            <Box borderRadius="inherit" w="full" bg="white" py="4">
                                <Text color="#2E6DED" fontSize="17">Buy</Text>
                            </Box>
                            <Box borderRadius="inherit" w="full" bg="#F9FBFF" py="4">
                                <Text fontSize="17" color="#ACB5BD">Sell</Text>
                            </Box>
                        </HStack>
                        <Box w="full" align="center" py="2">
                            <Text fontSize="13" fontWeight="black">
                                Instantly buy or sell <span><Link to="http://bitclout.com/" isExternal >CLOUT<ExternalLinkIcon mx="2px" mb="4px" /></Link></span> at the best price.
                            </Text>
                        </Box>

                        <Flex flexDir='column' align="center" p="2" overflow="auto" h="max" px="5">
                            <Box borderWidth="2px" borderColor="rgba(221, 226, 229, 0.5)" borderRadius="10" py="3" px="5" >
                                <Text color="#81868C" fontSize="18" fontWeight="regular">From</Text>
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
                            <Box mt="-3" mb="-3" bg="white" borderRadius="5" boxSize="38px" borderWidth="2px" borderColor="rgba(221, 226, 229, 0.5)" zIndex="overlay" d="flex">
                                <MdLoop color="#7E91BA" size="28px" style={{margin: "auto"}} />
                            </Box>
                            <Box p="4" borderWidth="2px" borderColor="rgba(221, 226, 229, 0.5)" borderRadius="10" >
                                <Text color="#81868C" fontSize="18" fontWeight="regular">To</Text>
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
                        </Flex>
                        <HStack w="full" justify="space-between" px="6" color="#81868C">
                            <Text fontSize="14px" >
                                Exchange Rate:
                            </Text>
                            <Text fontSize="14px" fontWeight="bold">---------</Text>
                        </HStack>
                        <HStack w="full" justify="space-between" px="6" color="#81868C">
                            <Text fontSize="14px" >
                                Est. Fees:
                            </Text>
                            <Text fontSize="14px" fontWeight="bold">0.0069 ETH</Text>
                        </HStack>
                        <VStack p="2" px="5" w="full">
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
