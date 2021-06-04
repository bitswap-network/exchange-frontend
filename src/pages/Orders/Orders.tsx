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
} from "@chakra-ui/react"
import React, { useEffect, useState, useMemo } from "react"
import { Column } from "react-table"
import { BlueButton } from "../../components/BlueButton"
import {
    OrderTableDataInterface,
    OrderTableColumns,
} from "../../interfaces/Order"
import { Chart } from "../../components/BitCloutChart/Chart"
import { OrderTable } from "./OrderTable"
import { OrderModal } from "./OrderModal"
import { useOrderBook, orderBookInterface } from "../../hooks"
import { getOrders } from "../../services/user"
import * as globalVars from "../../globalVars"
import { useRecoilState } from "recoil"
import { orderModalState } from "../../store"

export function Orders(): React.ReactElement {
    const [orderModalOpenOnLoad, setOrderOpenOnLoad] =
        useRecoilState(orderModalState)
    const columns = useMemo(
        () => OrderTableColumns,
        []
    ) as Column<OrderTableDataInterface>[]
    const [ordersHot, setOrders] = useState<OrderTableDataInterface[]>([])

    const { orderbook, orderbookIsLoading, orderbookIsError } = useOrderBook()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const parseOrderData = (orders: OrderTableDataInterface[]) => {
        const tempOrders: OrderTableDataInterface[] = []
        orders.forEach((order: OrderTableDataInterface) => {
            tempOrders.push({
                ...order,
                tldr: `${globalVars.capFirst(order.orderSide)} ${
                    order.orderQuantity
                } BCLT (${globalVars.capFirst(order.orderType)})`,
                status: `${
                    order.complete
                        ? "Closed"
                        : order.orderQuantityProcessed > 0
                        ? "Partial"
                        : "Active"
                }`,
                orderTypeCapped: globalVars.capFirst(order.orderType),
                quantityString: `${order.orderQuantity} BCLT`,
                priceString: `${
                    order.orderPrice ? `$${order.orderPrice}` : "-"
                }`,
                createdAgo: globalVars.timeSince(new Date(order.created)),
                completedAgo: order.completeTime
                    ? globalVars.timeSince(new Date(order.completeTime))
                    : "-",
            })
        })
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

    // if (true) {
    console.log("orderbook", orderbookIsError, orderbookIsLoading, orderbook)
    // }

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
                    <Flex flex="0.7" maxW="70%">
                        <Tabs w="full" variant="order">
                            <Center>
                                <TabList
                                    w="full"
                                    ml="4"
                                    mr="4"
                                    mb="4"
                                    justifyContent="space-evenly"
                                >
                                    <Tab w="33%" pt="3" pb="3">
                                        All Orders ({orders.length})
                                    </Tab>
                                    <Tab w="33%" pt="3" pb="3">
                                        Active Orders (
                                        {
                                            orders.filter(
                                                (order) =>
                                                    order.complete === false
                                            ).length
                                        }
                                        )
                                    </Tab>
                                    <Tab w="33%" pt="3" pb="3">
                                        Completed Orders (
                                        {
                                            orders.filter(
                                                (order) =>
                                                    order.complete === true
                                            ).length
                                        }
                                        )
                                    </Tab>
                                </TabList>
                            </Center>
                            <TabPanels>
                                <TabPanel>
                                    <Stack spacing={4}>
                                        <OrderTable
                                            data={orders}
                                            columns={columns}
                                        />
                                    </Stack>
                                </TabPanel>
                                <TabPanel>
                                    <Stack spacing={4} w="100%">
                                        <OrderTable
                                            data={orders.filter(
                                                (order) =>
                                                    order.complete === false
                                            )}
                                            columns={columns}
                                        />
                                    </Stack>
                                </TabPanel>
                                <TabPanel>
                                    {" "}
                                    <Stack spacing={4} w="100%">
                                        <OrderTable
                                            data={orders.filter(
                                                (order) =>
                                                    order.complete === true
                                            )}
                                            columns={columns}
                                        />
                                    </Stack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Flex>
                    <Flex flex="0.3">
                        <Flex
                            bg="white"
                            w="full"
                            borderRadius="8"
                            boxShadow="xs"
                            align="center"
                            justify="flex-start"
                            flexDir="column"
                            p="6"
                        >
                            <Heading as="h2" size="md" mb="2">
                                BitClout Market Value
                            </Heading>
                            <Box w="full" h="270px">
                                <Chart ticks={6} />
                            </Box>
                            <Table variant="simple">
                                <Thead>
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
                                                <Td
                                                    color="red.500"
                                                    fontSize="sm"
                                                >
                                                    {"Sell"}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    {order.priceString}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    {order.quantityString}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    {order.totalString}
                                                </Td>
                                            </Tr>
                                        ))}
                                    {!orderbookIsLoading &&
                                        !orderbookIsError &&
                                        orderbook?.bids.map((order, i) => (
                                            <Tr
                                                key={i + orderbook?.asks.length}
                                            >
                                                <Td
                                                    color="green.500"
                                                    fontSize="sm"
                                                >
                                                    {"Buy"}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    {order.priceString}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    {order.quantityString}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    {order.totalString}
                                                </Td>
                                            </Tr>
                                        ))}
                                </Tbody>
                            </Table>
                        </Flex>
                    </Flex>
                </Flex>
            </VStack>
        </>
    )
}
