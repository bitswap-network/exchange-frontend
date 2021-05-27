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
    Text,
    Box,
    useDisclosure,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    HStack,
} from '@chakra-ui/react'
import React from 'react'
import { Column } from 'react-table'
import { BlueButton } from '../../components/BlueButton'
import { OrderCard } from './OrderCard'
import { AiOutlineSearch, AiOutlineInfoCircle } from 'react-icons/ai'
import { Order, OrderType } from '../../types/Order'
import { OrderTable } from './OrderTable'
import { OrderModal } from './OrderModal'

export function Orders(): React.ReactElement {
    const data = React.useMemo(
        () => [
            {
                id: 1,
                type: OrderType.Buy,
                quantity: 20,
                price: 12.5,
                date_posted: '15/02/2021',
                date_fullfiled: '-',
                status: 'active',
            },
            {
                id: 2,
                type: OrderType.Sell,
                quantity: 5,
                price: 12.5,
                date_posted: '15/02/2021',
                date_fullfiled: '15/02/2021',
                status: 'fullfiled',
            },
            {
                id: 3,
                type: OrderType.Buy,
                quantity: 15,
                price: 12.5,
                date_posted: '15/02/2021',
                date_fullfiled: '-',
                status: 'active',
            },
        ],
        []
    )
    const columns = React.useMemo(
        () => [
            {
                Header: 'Order ID',
                accessor: 'id',
                isNumeric: true,
            },
            {
                Header: 'Order Type',
                accessor: 'type',
            },
            {
                Header: 'Quantity',
                accessor: 'quantity',
                isNumeric: true,
            },
            {
                Header: 'Price',
                accessor: 'price',
                isNumeric: true,
            },
            {
                Header: 'Date Posted',
                accessor: 'date_posted',
            },
            {
                Header: 'Date Fullfiled',
                accessor: 'date_fullfiled',
            },
            {
                Header: 'Status',
                accessor: 'status',
            },
        ],
        []
    ) as Column<Order>[]

    const orderBook = [
        {
            id: 1,
            type: 'buy',
            price: 100,
            quantity: 10,
        },
        {
            id: 2,
            type: 'sell',
            price: 120,
            quantity: 3.4,
        },
        {
            id: 3,
            type: 'buy',
            price: 99,
            quantity: 5.6,
        },
        {
            id: 4,
            type: 'buy',
            price: 125,
            quantity: 2.3,
        },
        {
            id: 5,
            type: 'sell',
            price: 90,
            quantity: 10.6,
        },
    ]

    const headerData = {
        recentOrderBCLT: 40,
        recentOrderETH: 10,
        BCLTPrice: 123.45,
        ETHPrice: 3123.45,
        BCLTChange: 17.5,
        ETHChange: -10.2,
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <OrderModal isOpen={isOpen} onClose={onClose} />
            <VStack spacing={6}>
                <Flex
                    w="full"
                    h="30px"
                    border="2px solid black"
                    flexDir="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                >
                    <Text fontWeight="600" fontSize="sm">
                        MOST RECENT ORDER:{' '}
                        <span style={{ fontWeight: 500 }}>
                            {headerData.recentOrderBCLT} BCLT |{' '}
                            {headerData.recentOrderETH} ETH
                        </span>
                    </Text>

                    <Text fontWeight="600" fontSize="sm">
                        HIGHEST ORDER TODAY
                    </Text>

                    <HStack spacing={1}>
                        <Text fontWeight="600" fontSize="sm">
                            BCLT:
                        </Text>
                        <Text fontWeight="500" fontSize="sm">
                            ${headerData.BCLTPrice}
                        </Text>
                        {headerData.BCLTChange >= 0 ? (
                            <Text
                                fontWeight="400"
                                fontSize="xs"
                                pl="2"
                                pr="2"
                                bg="#B7F0D4"
                            >
                                <span style={{ color: '#3B775A' }}>▲</span>{' '}
                                {headerData.BCLTChange}%
                            </Text>
                        ) : (
                            <Text
                                fontWeight="400"
                                fontSize="xs"
                                pl="2"
                                pr="2"
                                bg="#F9C3BF"
                            >
                                <span style={{ color: '#EB5347' }}>▼</span>{' '}
                                {headerData.BCLTChange}%
                            </Text>
                        )}
                    </HStack>

                    <HStack spacing={1}>
                        <Text fontWeight="600" fontSize="sm">
                            ETH:
                        </Text>
                        <Text fontWeight="500" fontSize="sm">
                            ${headerData.ETHPrice}
                        </Text>
                        {headerData.ETHChange >= 0 ? (
                            <Text
                                fontWeight="400"
                                fontSize="xs"
                                pl="2"
                                pr="2"
                                bg="#B7F0D4"
                            >
                                <span style={{ color: '#3B775A' }}>▲</span>{' '}
                                {headerData.ETHChange}%
                            </Text>
                        ) : (
                            <Text
                                fontWeight="400"
                                fontSize="xs"
                                pl="2"
                                pr="2"
                                bg="#F9C3BF"
                            >
                                <span style={{ color: '#EB5347' }}>▼</span>{' '}
                                {headerData.ETHChange}%
                            </Text>
                        )}
                    </HStack>
                </Flex>
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
                                        All Orders ({data.length})
                                    </Tab>
                                    <Tab w="33%" pt="3" pb="3">
                                        Active Orders (
                                        {
                                            data.filter(
                                                (order) =>
                                                    order.status == 'active'
                                            ).length
                                        }
                                        )
                                    </Tab>
                                    <Tab w="33%" pt="3" pb="3">
                                        Fulfilled Orders (
                                        {
                                            data.filter(
                                                (order) =>
                                                    order.status == 'fullfiled'
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
                                            data={data}
                                            columns={columns}
                                        />
                                    </Stack>
                                </TabPanel>
                                <TabPanel>
                                    <Stack spacing={4} w="100%">
                                        <OrderTable
                                            data={data.filter(
                                                (order) =>
                                                    order.status == 'active'
                                            )}
                                            columns={columns}
                                        />
                                    </Stack>
                                </TabPanel>
                                <TabPanel>
                                    {' '}
                                    <Stack spacing={4} w="100%">
                                        <OrderTable
                                            data={data.filter(
                                                (order) =>
                                                    order.status == 'fullfiled'
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
                            <Box bg="#F3F7FF" w="90%" h="200px"></Box>
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
                                    {orderBook.map((order) => (
                                        <Tr key={order.id}>
                                            <Td color="gray.500" fontSize="sm">
                                                {order.type}
                                            </Td>
                                            <Td color="gray.500" fontSize="sm">
                                                ${order.price}
                                            </Td>
                                            <Td color="gray.500" fontSize="sm">
                                                {order.quantity}
                                            </Td>
                                            <Td color="gray.500" fontSize="sm">
                                                ${order.price * order.quantity}
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
