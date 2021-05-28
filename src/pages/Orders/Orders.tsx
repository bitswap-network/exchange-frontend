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
    HStack,
    useDisclosure,
} from "@chakra-ui/react"
import React from "react"
import { Column } from "react-table"
import { BlueButton } from "../../components/BlueButton"
import { OrderCard } from "./OrderCard"
import { AiOutlineSearch, AiOutlineInfoCircle } from "react-icons/ai"
import { Order, OrderType } from "../../types/Order"
import { OrderTable } from "./OrderTable"
import { OrderModal } from "./OrderModal"

export function Orders(): React.ReactElement {
    const data = React.useMemo(
        () => [
            {
                id: 1,
                type: OrderType.Buy,
                quantity: 20,
                price: 12.5,
            },
            {
                id: 2,
                type: OrderType.Sell,
                quantity: 5,
                price: 12.5,
            },
            {
                id: 3,
                type: OrderType.Buy,
                quantity: 15,
                price: 12.5,
            },
        ],
        []
    )
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
        ],
        []
    ) as Column<Order>[]

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <OrderModal isOpen={isOpen} onClose={onClose} />
            <VStack spacing={8}>
                <Flex w="100%">
                    <Heading> Orders </Heading>
                    <Spacer />
                    <BlueButton text="New Order" onClick={onOpen} />
                </Flex>
                <Flex w="100%" wrap="wrap">
                    {/* TODO: Replace links and statuses with data here  */}
                    <OrderCard
                        title="Ongoing Orders"
                        linkText="Review"
                        linkSrc="/home"
                        status="Ordered two minutes ago"
                        icon={<AiOutlineSearch />}
                    />
                    <Spacer />
                    <OrderCard
                        title="Pending Orders"
                        linkText="Learn More"
                        linkSrc="/home"
                        status="This order has not been processed"
                        icon={<AiOutlineInfoCircle />}
                    />
                    <Spacer />
                    <OrderCard
                        title="Ongoing Orders"
                        linkText="Learn More"
                        linkSrc="/home"
                        status="You can no longer cancel this offer"
                        icon={<AiOutlineInfoCircle />}
                    />
                </Flex>
                <Tabs w="100%" variant="order">
                    <Center>
                        <TabList>
                            <Tab>All Orders</Tab>
                            <Tab>Active Orders</Tab>
                            <Tab>Pending Orders</Tab>
                            <Tab>Fulfilled Orders</Tab>
                        </TabList>
                    </Center>
                    <TabPanels>
                        <TabPanel>
                            <Stack spacing={4}>
                                <Heading as="h2" size="md">
                                    All Orders ({data.length})
                                </Heading>
                                <OrderTable data={data} columns={columns} />
                                <HStack spacing={4} alignItems="flex-start">
                                    <Stack spacing={4} w="100%">
                                        <Heading as="h2" size="md">
                                            Buy Orders
                                        </Heading>
                                        <OrderTable
                                            data={data.filter(
                                                (order) =>
                                                    order.type == OrderType.Buy
                                            )}
                                            columns={columns}
                                        />
                                    </Stack>
                                    <Spacer />
                                    <Stack spacing={4} w="100%">
                                        <Heading as="h2" size="md">
                                            Sell Orders
                                        </Heading>
                                        <OrderTable
                                            data={data.filter(
                                                (order) =>
                                                    order.type == OrderType.Sell
                                            )}
                                            columns={columns}
                                        />
                                    </Stack>
                                </HStack>
                            </Stack>
                        </TabPanel>
                        <TabPanel>Tab 2</TabPanel>
                        <TabPanel>Tab 3</TabPanel>
                        <TabPanel>Tab 4</TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
        </>
    )
}
