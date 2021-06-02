/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState, useMemo } from "react"
import { Box, Skeleton } from "@chakra-ui/react"
import { ResponsiveLine } from "@nivo/line"
import { ChartData as ChartDataInterface, Depth } from "../../interfaces/Depth"
import { getDepth } from "../../services/utility"
import { ParentSize } from "@visx/responsive"

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

    const [depthHot, setDepth] = useState<ChartDataInterface>({
        id: "BitClout Market Price",
        data: [],
    })
    const [loading, setLoading] = useState(true)
    const [minY, setMinY] = useState(0)
    const [maxY, setMaxY] = useState(100)

    useEffect(() => {
        getDepth("max").then((depthResponse) => {
            const parsedData: ChartDataInterface = {
                id: "BitClout Market Price",
                data: [],
            }
            depthResponse.data.data.forEach((depthItem: Depth, i: number) => {
                const date = new Date(depthItem.timestamp)
                parsedData.data.push({
                    x: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
                    y: depthItem.marketSell
                        ? (depthItem.marketSell + depthItem.marketBuy) / 2
                        : 100,
                })
            })
            // console.log("parsed depth", parsedCopy)
            setDepth(parsedData)
            setLoading(false)
        })
    }, [])

    // const parseDepth = (depth: ChartDataInterface) => {
    //     if (depth.data.length > 0) {
    //         const tempDepth: ChartDataInterface[] = []
    //         depthArr.forEach((depthItem: Depth) => {
    //             tempDepth.push({
    //                 timestamp: new Date(depthItem.timestamp),
    //                 price: (depthItem.marketSell + depthItem.marketBuy) / 2,
    //             })
    //         })
    //         setMaxY(
    //             tempDepth.reduce((a, b) => (a.price > b.price ? a : b)).price
    //         )
    //         setMinY(
    //             tempDepth.reduce((a, b) => (a.price < b.price ? a : b)).price
    //         )
    //         return tempDepth
    //     } else {
    //         return {
    //             id: "BitClout Market Price",
    //             data: [],
    //         }
    //     }
    // }

    // const depthMemo = useMemo(
    //     () => parseDepth(depthHot),
    //     [depthHot]
    // ) as ChartDataInterface

    // if (loading) {
    //     return null
    // }

    return (
        <ParentSize>
            {(parent) => (
                <Box overflow="hidden" d="flex" w={parent.width} pos="relative">
                    <Skeleton
                        startColor="gray.100"
                        endColor="gray.300"
                        isLoaded={!loading}
                        w="full"
                        height={parent.width * 0.7}
                    >
                        <ResponsiveLine
                            data={[depthHot]}
                            xScale={{ type: "time", format: "%Y-%m-%d" }}
                            yScale={{ type: "linear" }}
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
