/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState, useMemo } from "react"
import { Box, Skeleton } from "@chakra-ui/react"
import { ResponsiveLine } from "@nivo/line"
import { ChartData as ChartDataInterface, Depth } from "../../interfaces/Depth"
import { getDepth, getOrderHistory } from "../../services/utility"
import { ParentSize } from "@visx/responsive"
import { select } from "@storybook/addon-knobs"

export function Chart() {
    const data = {
        id: "BitClout Market Price",
        data: [
            {
                x: new Date(),
                y: 100,
            },
        ],
    }
    const curveOptions = [
        "linear",
        "monotoneX",
        "step",
        "stepBefore",
        "stepAfter",
    ]
    interface CustomSymbolInterface {
        size: number
        color: string
        borderWidth: number
        borderColor: string
    }
    const CustomSymbol = ({
        size,
        color,
        borderWidth,
        borderColor,
    }: CustomSymbolInterface) => (
        <g>
            <circle
                fill="#fff"
                r={size / 2}
                strokeWidth={borderWidth}
                stroke={borderColor}
            />
            <circle
                r={size / 5}
                strokeWidth={borderWidth}
                stroke={borderColor}
                fill={color}
                fillOpacity={0.35}
            />
        </g>
    )
    const [depthHot, setDepth] = useState<ChartDataInterface>({
        id: "BitClout Market Price",
        data: [],
    })
    const [loading, setLoading] = useState(true)
    const [minY, setMinY] = useState(0)
    const [maxY, setMaxY] = useState(100)

    useEffect(() => {
        getOrderHistory().then((response) => {
            // console.log("orderhistoryrepsonse", response)
            const parsedData: ChartDataInterface = {
                id: "BitClout Market Price",
                data: [],
            }
            response.data.forEach(
                (item: { timestamp: Date; price: number }) => {
                    const date = new Date(item.timestamp)
                    parsedData.data.push({
                        x: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
                        y: item.price,
                    })
                }
            )
            setDepth(parsedData)
            setLoading(false)
        })

        // getDepth("max").then((depthResponse) => {
        //     const parsedData: ChartDataInterface = {
        //         id: "BitClout Market Price",
        //         data: [],
        //     }
        //     depthResponse.data.data.forEach((depthItem: Depth, i: number) => {
        //         const date = new Date(depthItem.timestamp)
        //         parsedData.data.push({
        //             x: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        //             y: depthItem.marketSell
        //                 ? (depthItem.marketSell + depthItem.marketBuy) / 2
        //                 : 100,
        //         })
        //     })
        //     console.log("parsed depth", parsedData)
        //     setDepth(parsedData)
        //     setLoading(false)
        // })
    }, [])

    return (
        <ParentSize>
            {(parent) => (
                <Box
                    overflow="hidden"
                    d="flex"
                    w={parent.width}
                    pos="relative"
                    p="4"
                >
                    <Skeleton
                        startColor="gray.100"
                        endColor="gray.300"
                        isLoaded={!loading}
                        w="full"
                        height={parent.width * 0.7}
                    >
                        <ResponsiveLine
                            data={[depthHot]}
                            xScale={{
                                type: "time",
                                format: "%Y-%m-%d",
                                useUTC: false,
                                precision: "day",
                            }}
                            yScale={{ type: "linear", min: 50, max: 200 }}
                            xFormat="time:%Y-%m-%d"
                            axisLeft={{
                                legend: "BitClout Market Price ($USD)",
                                legendOffset: 10,
                                legendPosition: "middle",
                                tickSize: 5,
                            }}
                            axisBottom={{
                                format: "%b %d",
                                tickValues: "every day",
                                legend: "Date",
                                legendOffset: -12,
                                legendPosition: "middle",
                            }}
                            curve={"monotoneX"}
                            enablePointLabel={true}
                            // pointSymbol={CustomSymbol}
                            pointSize={8}
                            pointBorderWidth={1}
                            pointBorderColor={{
                                from: "color",
                                modifiers: [["darker", 0.3]],
                            }}
                            useMesh={true}
                            enableSlices={false}
                            animate={true}
                            enableGridX={true}
                            enableGridY={true}
                            enableArea={true}
                        />
                        {/* <VictoryChart
                            height={parent.width * 0.7}
                            width={parent.width}
                            scale={{ x: "time" }}
                            padding={{
                                left: 55,
                                right: 20,
                                bottom: 55,
                                top: 20,
                            }}
                            animate={{
                                duration: 300,
                            }}
                            theme={VictoryTheme.material}
                            containerComponent={
                                <VictoryVoronoiContainer
                                    labels={({ datum }) =>
                                        `${
                                            datum.timestamp
                                                ? datum.timestamp.toDateString()
                                                : ""
                                        }, $${datum.price}`
                                    }
                                    labelComponent={<VictoryTooltip />}
                                />
                            }
                        >
                            <VictoryLine
                                samples={100}
                                style={{
                                    data: { stroke: "#2e6ded" },
                                    parent: { border: "1px solid #ccc" },
                                }}
                                data={depthMemo}
                                x="timestamp"
                                y="price"
                            />
                            <VictoryAxis
                                label="BitClout Price (USD)"
                                dependentAxis
                                style={{
                                    axisLabel: {
                                        padding: 40,
                                    },
                                }}
                                domain={{
                                    y: [0 + minY * 0.4, maxY + maxY * 0.5],
                                }}
                            />
                            <VictoryAxis
                                label="Date"
                                style={{
                                    axisLabel: {
                                        padding: 40,
                                    },
                                }}
                            />
                        </VictoryChart> */}
                    </Skeleton>
                </Box>
            )}
        </ParentSize>
    )
}
