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
    Table,
    Thead,
    Tbody,
    Box,
    Tr,
    Th,
    Td,
    HStack,
    Skeleton,
    SkeletonText,
} from "@chakra-ui/react";
import React, { useEffect, useState, useMemo } from "react";
import { Column } from "react-table";
import { BlueButton } from "../../components/BlueButton";
import { OrderTableDataInterface, OrderTableColumns } from "../../interfaces/Order";
import { Chart } from "../../components/BitCloutChart/Chart";
import { OrderTable } from "./OrderTable";
import { OrderModal } from "./OrderModal";
import { useOrderBook, useOrders } from "../../hooks";
import { getOrders } from "../../services/user";
import * as globalVars from "../../globalVars";
import { useRecoilState, useRecoilValue } from "recoil";
import { orderModalState, tokenState } from "../../store";
import { CryptoCard } from "../../components/CryptoCard";
import { useUser } from "../../hooks";
import { getEthUSD } from "../../services/utility";
import { getMarketPrice } from "../../services/order";

export function Orders(): React.ReactElement {
    const [orderModalOpenOnLoad, setOrderOpenOnLoad] = useRecoilState(orderModalState);
    const columns = useMemo(() => OrderTableColumns, []) as Column<OrderTableDataInterface>[];
    // const [ordersHot, setOrders] = useState<OrderTableDataInterface[]>([])
    const token = useRecoilValue(tokenState);

    const { orders, ordersIsLoading, ordersIsError } = useOrders(token);
    const { user, userIsLoading, userIsError } = useUser(token);
    const [ethUsd, setEthUsd] = useState<number | null>(null);

    const { orderbook, orderbookIsLoading, orderbookIsError } = useOrderBook();
    const [marketBuy, setMarketBuy] = useState<number | null>(null);
    const [marketSell, setMarketSell] = useState<number | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const BCLT = {
        imageUri: "./bitcloutLogo.png",
        currency: globalVars.BITCLOUT,
        amount: user?.balance.bitclout,
        publicKey: user?.bitclout.publicKey,
    };
    useEffect(() => {
        getEthUSD().then((response) => {
            setEthUsd(response.data.data);
        });
        getMarketPrice(0.05, "buy").then((response) => {
            setMarketBuy(response.data.price * 20);
        });
        getMarketPrice(0.05, "sell").then((response) => {
            setMarketSell(response.data.price * 20);
        });
    }, []);

    const ETH = {
        imageUri: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png",
        currency: globalVars.ETHER,
        amount: user?.balance.ether,
        usdValue: ethUsd ? ethUsd * user?.balance.ether : null,
        publicKey: "",
    };

    useEffect(() => {
        if (orderModalOpenOnLoad) {
            onOpen();
            setOrderOpenOnLoad(false);
        }
    }, [orderModalOpenOnLoad]);

    return (
        <>
            <OrderModal isOpen={isOpen} onClose={onClose} />
            <VStack spacing={6}>
                <Flex w="full" flexdir="row" pl="4">
                    <Heading> Your Orders </Heading>
                    <Spacer />
                    <BlueButton text="New Order" onClick={onOpen} />
                </Flex>
                <Flex w="full" dir="row">
                    <Flex flex="0.75" maxW="75%">
                        <Tabs w="full" variant="order" h="70vh">
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
                                            <OrderTable data={orders ? orders : []} columns={columns} />
                                        </Stack>
                                    </TabPanel>
                                </TabPanels>
                            </Skeleton>
                        </Tabs>
                    </Flex>
                    <Flex flex="0.25" flexDir="column">
                        <Box pb="4" w="full">
                            <CryptoCard size="xs" active={true} border={false} imageUrl={BCLT.imageUri} currency={BCLT.currency} amount={BCLT.amount} />
                        </Box>
                        <Box w="full" mb="4">
                            <CryptoCard size="xs" active={true} border={false} imageUrl={ETH.imageUri} currency={ETH.currency} amount={ETH.amount} />
                        </Box>

                        <Box bg="white" w="full" borderRadius="8" boxShadow="xs" p="6" alignSelf="flex-start">
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
                            <Box w="full" maxH="325px" mt="2">
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
