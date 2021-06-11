/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState, useMemo } from "react"
import { Box, Skeleton } from "@chakra-ui/react"
import { ResponsiveLine } from "@nivo/line"
import { ChartData as ChartDataInterface } from "../../interfaces/Depth"
import { getOrderHistory } from "../../services/utility"
import { ParentSize } from "@visx/responsive"

const graphTheme = {
    fontSize: "12px",
    textColor: "#5c5c5c",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "transparent",
}

interface ChartProps {
    ticks: number
    dateTicks: number
}

export const Chart: React.FC<ChartProps> = ({ ticks, dateTicks }: ChartProps) => {
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
    const CustomSymbol = ({ size, color, borderWidth, borderColor }: CustomSymbolInterface) => (
        <g>
            <circle fill="#fff" r={size / 2} strokeWidth={borderWidth} stroke={borderColor} />
            <circle r={size / 5} strokeWidth={borderWidth} stroke={borderColor} fill={color} fillOpacity={0.35} />
        </g>
    )
    const [depthHot, setDepthHot] = useState<[]>([])
    const [loading, setLoading] = useState(true)
    const [minY, setMinY] = useState(0)
    const [maxY, setMaxY] = useState(0)
    const [dateTickValues, setDateTickValues] = useState<Date[]>([new Date()])

    useEffect(() => {
        getOrderHistory().then((response) => {
            setDepthHot(response.data)
            setLoading(false)
        })
    }, [])

    const parseData = (dataList: []) => {
        const parsedDataArr: ChartDataInterface = {
            id: "BitClout Market Price",
            data: [],
        }
        let min = 1000
        let max = 0
        let minDate = new Date()
        minDate.setDate(minDate.getDate() + 100)
        let maxDate = new Date(0)
        dataList.forEach((item: hotData) => {
            const date = new Date(item.timestamp)
            parsedDataArr.data.push({
                x: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                y: item.price,
            })
            if (date < minDate) {
                minDate = date
            }
            if (date > maxDate) {
                maxDate = date
            }
            min = Math.min(min, item.price - 30)
            max = Math.max(max, item.price + 30)
        })
        const dateRange = (maxDate - minDate) / (1000 * 60 * 60 * 24)
        const dateInterval = Math.ceil(dateRange / dateTicks)
        const datesArray = []
        for (let i = 0; i < dateTicks; i++) {
            datesArray.push(new Date(minDate.getMonth() + 1 + " " + minDate.getDate() + ", " + minDate.getFullYear()))
            minDate.setDate(minDate.getDate() + dateInterval)
        }
        setDateTickValues(datesArray)
        setMinY(min)
        setMaxY(max)

        return parsedDataArr
    }

    const depthMemo = useMemo(() => parseData(depthHot), [depthHot]) as ChartDataInterface

    return (
        <ParentSize>
            {(parent) => (
                <Box overflow="hidden" d="flex" w={parent.width} pos="relative" p="4">
                    <Skeleton
                        startColor="gray.100"
                        endColor="gray.300"
                        isLoaded={!loading}
                        w="full"
                        height={parent.width * 0.7}
                    >
                        <ResponsiveLine
                            theme={graphTheme}
                            data={[depthMemo]}
                            colors="#4483ef"
                            tooltip={(point) => {
                                const date = new Date(point.point.data.x).toString().split(" ")
                                return (
                                    <Box bgColor="white" borderRadius="4" padding="2" boxShadow="md" fontSize="x-small">
                                        {date[1] + " " + date[2] + " " + date[3] + ", $" + point.point.data.y}
                                    </Box>
                                )
                            }}
                            margin={{
                                left: 50,
                                bottom: 55,
                                right: parent.width * 0.05,
                                top: parent.width * 0.03,
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
                                legend: "Market Price ($USD)",
                                legendOffset: -40,
                                legendPosition: "middle",
                                tickValues: ticks,
                                tickSize: 0,
                                tickPadding: 10,
                                tickRotation: 0,
                            }}
                            axisBottom={{
                                format: "%m/%d",
                                tickValues: dateTickValues,
                                legend: "Date",
                                legendOffset: 40,
                                tickPadding: 10,
                                tickSize: 5,
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
