/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState, useMemo } from "react"
import { Box, Skeleton } from "@chakra-ui/react"
import { ResponsiveLine } from "@nivo/line"
import { ChartData as ChartDataInterface } from "../../interfaces/Depth"
import { getOrderHistory } from "../../services/utility"
import { ParentSize } from "@visx/responsive"

export function Chart(props: any) {
    interface CustomSymbolInterface {
        size: number
        color: string
        borderWidth: number
        borderColor: string
    }
    interface hotData {
        timestamp: Date
        price: number
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
    const [depthHot, setDepthHot] = useState<[]>([])
    const [loading, setLoading] = useState(true)
    const [minY, setMinY] = useState(0)
    const [maxY, setMaxY] = useState(0)

    useEffect(() => {
        getOrderHistory().then((response) => {
            console.log("orderhistoryrepsonse", response)
            setDepthHot(response.data)
            setLoading(false)
        })
    }, [])

    const parseData = (dataList: []) => {
        const parsedDataArr: ChartDataInterface = {
            id: "BitClout Market Price",
            data: [],
        }
        let min = 1000000
        let max = 0
        dataList.forEach((item: hotData) => {
            const date = new Date(item.timestamp)
            parsedDataArr.data.push({
                x: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
                y: item.price,
            })
            min = Math.min(min, item.price - 30)
            max = Math.max(max, item.price + 30)
        })
        setMinY(min)
        setMaxY(max)
        return parsedDataArr
    }

    const depthMemo = useMemo(
        () => parseData(depthHot),
        [depthHot]
    ) as ChartDataInterface

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
                            data={[depthMemo]}
                            colors="#4483ef"
                            tooltip={(point) => {
                                const date = new Date(point.point.data.x)
                                    .toString()
                                    .split(" ")
                                return (
                                    <Box
                                        bgColor="white"
                                        borderRadius="4"
                                        padding="2"
                                        boxShadow="md"
                                        fontSize="xx-small"
                                    >
                                        {date[1] +
                                            " " +
                                            date[2] +
                                            " " +
                                            date[3] +
                                            ", " +
                                            point.point.data.y}
                                    </Box>
                                )
                            }}
                            margin={{
                                left: 50,
                                bottom: 50,
                                right: 20,
                                top: 20,
                            }}
                            xScale={{
                                type: "time",
                                format: "%Y-%m-%d",
                                useUTC: false,
                                precision: "day",
                            }}
                            yScale={{ type: "linear", min: minY, max: maxY }}
                            xFormat="time:%Y-%m-%d"
                            axisLeft={{
                                legend: "BitClout Market Price ($USD)",
                                legendOffset: -45,
                                legendPosition: "middle",
                                tickValues: props.ticks,
                                tickSize: 0,
                                tickPadding: 10,
                                tickRotation: 0,
                            }}
                            axisBottom={{
                                format: "%b %d",
                                tickValues: 5,
                                legend: "Date",
                                legendOffset: 35,
                                legendPosition: "middle",
                            }}
                            curve={"monotoneX"}
                            areaBaselineValue={minY}
                            enablePointLabel={true}
                            pointSymbol={CustomSymbol}
                            pointSize={8}
                            pointBorderWidth={1}
                            pointBorderColor={{
                                from: "color",
                                modifiers: [["darker", 0.3]],
                            }}
                            useMesh={true}
                            enableSlices={false}
                            animate={true}
                            enableGridX={false}
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
