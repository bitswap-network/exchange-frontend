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
} from "@chakra-ui/react"
import React, { useEffect, useState, useMemo } from "react"
import { Column } from "react-table"
import { BlueButton } from "../../components/BlueButton"
import { OrderTableDataInterface, OrderTableColumns } from "../../interfaces/Order"
import { Chart } from "../../components/BitCloutChart/Chart"
import { OrderTable } from "./OrderTable"
import { OrderModal } from "./OrderModal"
import { useOrderBook } from "../../hooks"
import { getOrders } from "../../services/user"
import * as globalVars from "../../globalVars"
import { useRecoilState, useRecoilValue } from "recoil"
import { orderModalState, tokenState } from "../../store"
import { CryptoCard } from "../../components/CryptoCard"
import { useUser } from "../../hooks"
import { getEthUSD } from "../../services/utility"
import { getMarketPrice } from "../../services/order"

export function Orders(): React.ReactElement {
    const [orderModalOpenOnLoad, setOrderOpenOnLoad] = useRecoilState(orderModalState)
    const columns = useMemo(() => OrderTableColumns, []) as Column<OrderTableDataInterface>[]
    const [ordersHot, setOrders] = useState<OrderTableDataInterface[]>([])
    const token = useRecoilValue(tokenState)
    const { user } = useUser(token)
    const [ethUsd, setEthUsd] = useState<number | null>(null)

    const { orderbook, orderbookIsLoading, orderbookIsError } = useOrderBook()
    const [marketBuy, setMarketBuy] = useState<number | null>(null)
    const [marketSell, setMarketSell] = useState<number | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const BCLT = {
        imageUri: "./bitcloutLogo.png",
        currency: globalVars.BITCLOUT,
        amount: user?.balance.bitclout,
        publicKey: user?.bitclout.publicKey,
    }
    useEffect(() => {
        getEthUSD().then((response) => {
            setEthUsd(response.data.data)
        })
        getMarketPrice(0.1, "buy").then((response) => {
            setMarketBuy(response.data.price * 10)
        })
        getMarketPrice(0.1, "sell").then((response) => {
            setMarketSell(response.data.price * 10)
        })
    }, [])

    const ETH = {
        imageUri:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png",
        currency: globalVars.ETHER,
        amount: user?.balance.ether,
        usdValue: ethUsd ? ethUsd * user?.balance.ether : null,
        publicKey: "",
    }
    const parseOrderData = (orders: OrderTableDataInterface[]) => {
        const tempOrders: OrderTableDataInterface[] = []
        if (orders.length > 0) {
            orders.forEach((order: OrderTableDataInterface) => {
                tempOrders.push({
                    ...order,
                    tldr: `${globalVars.capFirst(order.orderSide)} ${order.orderQuantity} ${
                        globalVars.BITCLOUT
                    } (${globalVars.capFirst(order.orderType)})`,
                    status: `${
                        order.error !== ""
                            ? "Error"
                            : order.complete
                            ? "Closed"
                            : order.orderQuantityProcessed > 0
                            ? "Partial"
                            : "Active"
                    }`,
                    orderTypeCapped: globalVars.capFirst(order.orderType),
                    quantityString: `${order.orderQuantity} ${globalVars.BITCLOUT}`,
                    priceString: `${order.orderPrice ? `$${+order.orderPrice.toFixed(2)}` : "-"}`,
                    createdAgo: globalVars.timeSince(new Date(order.created)),
                    completedAgo: order.completeTime ? globalVars.timeSince(new Date(order.completeTime)) : "-",
                })
            })
        }

        return tempOrders
    }

    useEffect(() => {
        getOrders().then((response) => {
            setOrders(response.data.data)
        })
    }, [])
    useEffect(() => {
        if (orderModalOpenOnLoad) {
            onOpen()
            setOrderOpenOnLoad(false)
        }
    }, [orderModalOpenOnLoad])

    const orders = useMemo(() => parseOrderData(ordersHot), [ordersHot])

    return (
        <>
            <OrderModal isOpen={isOpen} onClose={onClose} />
            <VStack spacing={6}>
                <Flex w="full">
                    <Heading> Your Orders </Heading>
                    <Spacer />
                    <BlueButton text="New Order" onClick={onOpen} />
                </Flex>
                <Flex w="full" dir="row">
                    <Flex flex="0.75" maxW="75%">
                        <Tabs w="full" variant="order" h="70vh">
                            <Center>
                                <TabList w="full" ml="4" mr="4" mb="4" justifyContent="space-evenly">
                                    <Tab w="25%" pt="3" pb="3">
                                        Active Orders ({orders.filter((order) => order.complete === false).length})
                                    </Tab>
                                    <Tab w="25%" pt="3" pb="3">
                                        Completed Orders (
                                        {orders.filter((order) => order.complete === true && order.error === "").length}
                                        )
                                    </Tab>
                                    <Tab w="25%" pt="3" pb="3">
                                        Cancelled Orders ({orders.filter((order) => order.error !== "").length})
                                    </Tab>
                                    <Tab w="25%" pt="3" pb="3">
                                        All Orders ({orders.length})
                                    </Tab>
                                </TabList>
                            </Center>
                            <TabPanels>
                                <TabPanel>
                                    <Stack spacing={4} w="100%">
                                        <OrderTable
                                            data={orders.filter((order) => order.complete === false)}
                                            columns={columns}
                                        />
                                    </Stack>
                                </TabPanel>
                                <TabPanel>
                                    <Stack spacing={4} w="100%">
                                        <OrderTable
                                            data={orders.filter(
                                                (order) => order.complete === true && order.error === ""
                                            )}
                                            columns={columns}
                                        />
                                    </Stack>
                                </TabPanel>
                                <TabPanel>
                                    <Stack spacing={4} w="100%">
                                        <OrderTable
                                            data={orders.filter((order) => order.error !== "")}
                                            columns={columns}
                                        />
                                    </Stack>
                                </TabPanel>
                                <TabPanel>
                                    <Stack spacing={4} w="full">
                                        <OrderTable data={orders} columns={columns} />
                                    </Stack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Flex>
                    <Flex flex="0.25" flexDir="column">
                        <Box pb="4" w="full">
                            <CryptoCard
                                size="xs"
                                active={true}
                                border={false}
                                imageUrl={BCLT.imageUri}
                                currency={BCLT.currency}
                                amount={BCLT.amount}
                            />
                        </Box>
                        <Box w="full" mb="4">
                            <CryptoCard
                                size="xs"
                                active={true}
                                border={false}
                                imageUrl={ETH.imageUri}
                                currency={ETH.currency}
                                amount={ETH.amount}
                            />
                        </Box>

                        <Box bg="white" w="full" borderRadius="8" boxShadow="xs" p="6" alignSelf="flex-start">
                            <HStack ml="3" mr="3">
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
                                >
                                    Market Ask: {marketBuy ? `$${marketBuy.toFixed(2)}` : " - "}
                                </Flex>
                                <Spacer />
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
                                >
                                    Market Bid: {marketSell ? `$${marketSell.toFixed(2)}` : " - "}
                                </Flex>
                            </HStack>
                            <Box w="full" h="30vh" mt="2">
                                <Chart ticks={6} />
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
                                    <Tbody>
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
    )
}
