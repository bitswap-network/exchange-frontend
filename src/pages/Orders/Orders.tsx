import {
    Heading,
    Flex,
    Spacer,
    VStack,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Center,
    Stack,
    useDisclosure,
    Button,
    Table,
    Thead,
    Tbody,
    Box,
    Tr,
    Th,
    Td,
    HStack,
    Skeleton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { Column } from "react-table";
import { BlueButton } from "../../components/BlueButton";
import { OrderTableDataInterface, OrderTableColumns } from "../../interfaces/Order";
import { Chart } from "../../components/BitCloutChart/Chart";
import { OrderTable } from "./OrderTable";
import { OrderModal } from "./OrderModal";
import { useOrderBook, useOrders } from "../../hooks";
import * as globalVars from "../../globalVars";
import { useRecoilState, useRecoilValue } from "recoil";
import { orderModalState, orderInfoModalState, tokenState } from "../../store";
import { CryptoCard } from "../../components/CryptoCard";
import { useUser } from "../../hooks";
import { getMarketPrice } from "../../services/order";

export function Orders(): React.ReactElement {
    const [orderModalOpenOnLoad, setOrderOpenOnLoad] = useRecoilState(orderModalState);
    const [orderInfoModalOpenOnLoad, setOrderInfoModalOpenOnLoad] = useRecoilState(orderInfoModalState);
    const [tab, setTab] = useState(0);
    const columns = useMemo(() => OrderTableColumns, []) as Column<OrderTableDataInterface>[];
    // const [ordersHot, setOrders] = useState<OrderTableDataInterface[]>([])
    const token = useRecoilValue(tokenState);

    const { orders, ordersIsLoading, ordersIsError } = useOrders(token);
    const { user, userIsLoading, userIsError } = useUser(token);

    const { orderbook, orderbookIsLoading, orderbookIsError } = useOrderBook();
    const [marketBuy, setMarketBuy] = useState<number | null>(null);
    const [marketSell, setMarketSell] = useState<number | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const BCLT = {
        currency: globalVars.BITCLOUT,
        amount: user?.balance.bitclout,
    };
    const ETH = {
        currency: globalVars.ETHER,
        amount: user?.balance.ether,
    };
    useEffect(() => {
        getMarketPrice(0.05, "buy").then((response) => {
            setMarketBuy(response.data.price * 20);
        });
        getMarketPrice(0.05, "sell").then((response) => {
            setMarketSell(response.data.price * 20);
        });
    }, []);

    useEffect(() => {
        if (orderModalOpenOnLoad) {
            onOpen();
            setOrderOpenOnLoad(false);
        }
    }, [orderModalOpenOnLoad]);

    useEffect(() => {
        if (orderInfoModalOpenOnLoad[0]) {
            setTab(3);
        }
    }, [orderInfoModalOpenOnLoad]);

    const handleTabsChange = (tab: number) => {
        setTab(tab);
    };

    return (
        <>
            <OrderModal isOpen={isOpen} onClose={onClose} />
            <VStack spacing={8}>
                <Flex w="full" flexDirection="row" pl="4" mt={{ base: "10", md: "0" }}>
                    <Heading> Your Orders </Heading>
                    <Spacer />
                    <Button variant="solid" bgColor="#dbe6ff" color="brand.100" as={Link} to="/profile" w={{ base: "25%", md: "auto" }} mr="4">
                        View Wallet
                    </Button>
                    <BlueButton text="New Order" onClick={onOpen} w={{ base: "25%", md: "auto" }} mr="4" />
                </Flex>
                <Flex w="full" flexDirection={{ base: "column-reverse", lg: "row" }}>
                    <Flex flex={{ base: "1", lg: "0.75" }}>
                        <Tabs w="full" index={tab} onChange={handleTabsChange} variant="order" minH="280px" maxH={{ base: "400px", lg: "700px", xl: "1000px" }}>
                            <Center>
                                <TabList w="full" ml="4" mr="4" justifyContent="space-evenly">
                                    <Tab w="25%">Active Orders ({orders ? orders.filter((order) => order.complete === false).length : 0})</Tab>
                                    <Tab w="25%">
                                        Completed Orders ({orders ? orders.filter((order) => order.complete === true && order.error === "").length : 0})
                                    </Tab>
                                    <Tab w="25%">Cancelled Orders ({orders ? orders.filter((order) => order.error !== "").length : 0})</Tab>
                                    <Tab w="25%">All Orders ({orders ? orders.length : 0})</Tab>
                                </TabList>
                            </Center>
                            <Skeleton
                                isLoaded={!ordersIsLoading}
                                mt={!ordersIsLoading ? "0" : "4"}
                                mr={!ordersIsLoading ? "0" : "4"}
                                ml={!ordersIsLoading ? "0" : "4"}
                                height="40px"
                            >
                                <TabPanels w="full">
                                    <TabPanel>
                                        <Stack w="100%">
                                            <OrderTable data={orders ? orders.filter((order) => order.complete === false) : []} columns={columns} />
                                        </Stack>
                                    </TabPanel>
                                    <TabPanel>
                                        <Stack w="100%">
                                            <OrderTable
                                                data={orders ? orders.filter((order) => order.complete === true && order.error === "") : []}
                                                columns={columns}
                                            />
                                        </Stack>
                                    </TabPanel>
                                    <TabPanel>
                                        <Stack w="100%">
                                            <OrderTable data={orders ? orders.filter((order) => order.error !== "") : []} columns={columns} />
                                        </Stack>
                                    </TabPanel>
                                    <TabPanel>
                                        <Stack w="full">
                                            <OrderTable filter={"all"} data={orders ? orders : []} columns={columns} />
                                        </Stack>
                                    </TabPanel>
                                </TabPanels>
                            </Skeleton>
                        </Tabs>
                    </Flex>
                    <Flex flex={{ base: "1", lg: "0.25" }} mb={{ base: "40px", lg: "0px" }} flexDir="column">
                        <Flex flexDir="row" spacing={2} w="full" justify="space-between" mb="4">
                            <Box w="49%">
                                <CryptoCard
                                    size="xs"
                                    active={true}
                                    imageUrl={globalVars.BITCLOUT_LOGO}
                                    currency={globalVars.BITCLOUT}
                                    amount={BCLT.amount}
                                    border={true}
                                />
                            </Box>
                            <Box w="49%">
                                <CryptoCard active={true} imageUrl={globalVars.ETHER_LOGO} currency={globalVars.ETHER} amount={ETH.amount} border={true} />
                            </Box>
                        </Flex>
                        <Box bg="white" borderRadius="8" boxShadow="xs" p="6" alignSelf="center" w={{ base: "90%", lg: "full" }}>
                            <HStack ml="3" mr="3">
                                <Flex
                                    bgColor="#dbe6ff"
                                    p="4"
                                    color="brand.100"
                                    fontWeight="600"
                                    fontSize="sm"
                                    h="20px"
                                    align="center"
                                    justify="center"
                                    borderRadius="4"
                                    boxShadow="md"
                                    textOverflow="ellipsis"
                                    overflow="hidden"
                                    whiteSpace="nowrap"
                                >
                                    Market Ask: {marketBuy ? `$${marketBuy.toFixed(2)}` : " - "}
                                </Flex>
                                <Spacer />
                                <Flex
                                    bgColor="#dbe6ff"
                                    p="4"
                                    color="brand.100"
                                    fontWeight="600"
                                    fontSize="sm"
                                    h="20px"
                                    align="center"
                                    justify="center"
                                    borderRadius="4"
                                    boxShadow="md"
                                    textOverflow="ellipsis"
                                    overflow="hidden"
                                    whiteSpace="nowrap"
                                >
                                    Market Bid: {marketSell ? `$${marketSell.toFixed(2)}` : " - "}
                                </Flex>
                            </HStack>
                            <Box maxH="325px" w={{ base: "full", lg: "440px" }} mt="2">
                                <Chart ticks={6} dateTicks={5} />
                            </Box>
                            <Box w="full" maxH="300px" overflowY="auto" mt="4">
                                <Table variant="simple">
                                    <Thead position="sticky" top="0" zIndex="100" bgColor="white">
                                        <Tr>
                                            <Th color="gray.700" pt="5">
                                                Type
                                            </Th>
                                            <Th color="gray.700" pt="5">
                                                Price
                                            </Th>
                                            <Th color="gray.700" pt="5">
                                                Quantity
                                            </Th>
                                            <Th color="gray.700" pt="5">
                                                Total
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody bgColor="white">
                                        {!orderbookIsLoading &&
                                            !orderbookIsError &&
                                            orderbook?.asks.map((order, i) => (
                                                <Tr key={i}>
                                                    <Td color="red.500" fontSize="sm">
                                                        {"Sell"}
                                                    </Td>
                                                    <Td color="gray.500" fontSize="sm">
                                                        {order.priceString}
                                                    </Td>
                                                    <Td color="gray.500" fontSize="sm">
                                                        {order.quantityString}
                                                    </Td>
                                                    <Td color="gray.500" fontSize="sm">
                                                        {order.totalString}
                                                    </Td>
                                                </Tr>
                                            ))}
                                        {!orderbookIsLoading &&
                                            !orderbookIsError &&
                                            orderbook?.bids.map((order, i) => (
                                                <Tr key={i + orderbook?.asks.length}>
                                                    <Td color="green.500" fontSize="sm">
                                                        {"Buy"}
                                                    </Td>
                                                    <Td color="gray.500" fontSize="sm">
                                                        {order.priceString}
                                                    </Td>
                                                    <Td color="gray.500" fontSize="sm">
                                                        {order.quantityString}
                                                    </Td>
                                                    <Td color="gray.500" fontSize="sm">
                                                        {order.totalString}
                                                    </Td>
                                                </Tr>
                                            ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </Box>
                    </Flex>
                </Flex>
            </VStack>
        </>
    );
}
