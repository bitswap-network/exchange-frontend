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
    Box,
    useDisclosure,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { Column } from "react-table"
import { BlueButton } from "../../components/BlueButton"
import { Order, OrderType } from "../../types/Order"
import {
    Depth as DepthInterface,
    ChartData as ChartDataInterface,
} from "../../interfaces/Depth"
import { BitCloutChart } from "../../components/BitCloutChart/BitCloutChart"
import { OrderTable } from "./OrderTable"
import { OrderModal } from "./OrderModal"
import { useOrderBook } from "../../hooks"
import { getOrders } from "../../services/user"
import { getDepth } from "../../services/utility"

export function Orders(): React.ReactElement {
    const columns = React.useMemo(
        () => [
            {
                Header: "Order ID",
                accessor: "id",
                isNumeric: true,
            },
            {
                Header: "Order Type",
                accessor: "type",
            },
            {
                Header: "Quantity",
                accessor: "quantity",
                isNumeric: true,
            },
            {
                Header: "Price",
                accessor: "price",
                isNumeric: true,
            },
            {
                Header: "Date Posted",
                accessor: "date_posted",
            },
            {
                Header: "Date Fullfiled",
                accessor: "date_fullfiled",
            },
            {
                Header: "Status",
                accessor: "status",
            },
        ],
        []
    ) as Column<Order>[]

    const [orders, setOrders] = useState([])

    const { orderbook, orderbookIsLoading, orderbookIsError } = useOrderBook()

    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        getOrders().then((response) => {
            setOrders(response.data.data)
        })
    }, [])

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
                                                    order.status == "active"
                                            ).length
                                        }
                                        )
                                    </Tab>
                                    <Tab w="33%" pt="3" pb="3">
                                        Fulfilled Orders (
                                        {
                                            orders.filter(
                                                (order) =>
                                                    order.status == "fullfiled"
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
                                                    order.status == "active"
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
                                                    order.status == "fullfiled"
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
                            h="full"
                            borderRadius="8"
                            boxShadow="xs"
                            align="center"
                            pt="6"
                            flexDir="column"
                        >
                            <Heading as="h2" size="md">
                                BitClout Market Value
                            </Heading>
                            <>
                                <BitCloutChart />
                                {/* <ParentSize>
                                    {({ width, height }) => (
                                        <BitcloutChart
                                            data={depth}
                                            width={width}
                                            height={height}
                                            dateRange={dateRange}
                                        />
                                    )}
                                </ParentSize> */}
                            </>

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
                                        orderbook.asks.map((order) => (
                                            <Tr key={order.id}>
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
                                                    ${order.price}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    {order.quantity}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    $
                                                    {order.price *
                                                        order.quantity}
                                                </Td>
                                            </Tr>
                                        ))}
                                    {!orderbookIsLoading &&
                                        !orderbookIsError &&
                                        orderbook.bids.map((order) => (
                                            <Tr key={order.id}>
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
                                                    ${order.price}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    {order.quantity}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    $
                                                    {order.price *
                                                        order.quantity}
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
