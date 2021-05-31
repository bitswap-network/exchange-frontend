/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"

import { Flex, Heading, Spacer, VStack, Box } from "@chakra-ui/react"

import { Column } from "react-table"
import { Order } from "../../interfaces/Order"
import { OrderTable } from "../Orders/OrderTable"
import { useOrderBook } from "../../hooks"

import { BitCloutChart } from "../../components/BitCloutChart/BitCloutChart"

export function Home(): React.ReactElement {
    // const [depth, setDepth] = useState<ChartDataInterface[]>([])
    // const [dateRange, setDateRange] = useState("max")
    // const [loading, setLoading] = useState(true)
    const { orderbook, orderbookIsLoading, orderbookIsError } = useOrderBook()

    // useEffect(() => {
    //     getDepth(dateRange).then((depthResponse) => {
    //         const parsedCopy: ChartDataInterface[] = []
    //         depthResponse.data.data.forEach((depthItem: DepthInterface) => {
    //             parsedCopy.push({
    //                 timestamp: new Date(depthItem.timestamp),
    //                 price: (depthItem.marketSell + depthItem.marketBuy) / 2,
    //             })
    //         })
    //         console.log("parsed depth", parsedCopy)
    //         setDepth(parsedCopy)
    //         setLoading(false)
    //     })
    // }, [dateRange])

    const columns = React.useMemo(
        () => [
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
                Header: "Total",
                accessor: "total",
                isNumeric: true,
            },
        ],
        []
    ) as Column<Order>[]

    return (
        <>
            <VStack spacing={8} marginTop="40px">
                <Flex flexDirection="row" w="100%">
                    <Flex flexDirection="column" w="50%" padding={4}>
                        <Heading>Home</Heading>
                        <Heading as="h2" size="md">
                            BitClout Market Value
                        </Heading>

                        <Box
                            boxShadow="xs"
                            borderRadius="lg"
                            overflow="hidden"
                            bg="white"
                            d="flex"
                            w="100%"
                            pos="relative"
                            marginTop={4}
                            padding={4}
                        >
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
                        </Box>
                    </Flex>
                    <Spacer />
                    <Flex flexDirection="column" w="50%" padding={4}>
                        <Heading as="h2" size="lg">
                            Order Book
                        </Heading>
                        <Heading
                            as="h2"
                            size="md"
                            marginTop={2}
                            marginBottom={4}
                        >
                            Sell Orders
                        </Heading>
                        <OrderTable
                            data={
                                !orderbookIsLoading && !orderbookIsError
                                    ? orderbook.asks
                                    : []
                            }
                            columns={columns}
                        />
                        <Heading
                            as="h2"
                            size="md"
                            marginTop={2}
                            marginBottom={4}
                        >
                            Buy Orders
                        </Heading>
                        <OrderTable
                            data={
                                !orderbookIsLoading && !orderbookIsError
                                    ? orderbook.bids
                                    : []
                            }
                            columns={columns}
                        />
                    </Flex>
                </Flex>
            </VStack>
        </>
    )
}
