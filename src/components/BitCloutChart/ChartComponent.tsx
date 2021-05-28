/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"
import { Box } from "@chakra-ui/react"
import {
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts"
import { Depth } from "../../interfaces/Depth"
import {
    Group,
    AreaClosed,
    LinePath,
    Bar,
    withParentSize,
    LinearGradient,
    PatternLines,
    AxisBottom,
    withTooltip,
    localPoint,
    Text,
    scaleTime,
    scaleLinear,
} from "@visx/visx"
import { bisector } from "d3-array"
import { format } from "d3-format"
import { MaxMinPrice } from "./MaxMinPrice"

export const formatFunc = format("$,.2f")

interface ChartProps {
    data: any[]
    dateRange?: string
    parentWidth: number
    parentHeight: number
    margin: {
        left: number
        right: number
        top: number
        bottom: number
    }
}

export const Chart: React.FC<ChartProps> = ({
    data,
    dateRange = "max",
    parentWidth,
    parentHeight,
    margin,
}: ChartProps) => {
    console.log("chart", data)
    const width = parentWidth - margin.left - margin.right
    const height = parentHeight - margin.top - margin.bottom
    const x = (d: any) => new Date(d.timestamp)
    const y = (d: any) => d.price
    const bisectDate = bisector((d) => x(d)).left
    const firstPoint = data[0]
    const currentPoint = data[data.length - 1]
    const minPrice = Math.min(...data.map(y))
    const maxPrice = Math.max(...data.map(y))
    const firstPrice = y(firstPoint)
    const currentPrice = y(currentPoint)
    const maxData = [
        { timestamp: x(firstPoint), price: maxPrice },
        { timestamp: x(currentPoint), price: maxPrice },
    ]
    const minData = [
        { timestamp: x(firstPoint), price: minPrice },
        { timestamp: x(currentPoint), price: minPrice },
    ]
    const xScale = scaleTime({
        domain: [data[0].timestamp, data[data.length - 1].timestamp], // x-coordinate data values
        range: [0, width], // svg x-coordinates, svg x-coordinates increase left to right
        round: true,
    })
    const yScale = scaleLinear({
        domain: [data[0].price, data[1].price], // y-coordinate data values
        // svg y-coordinates, these increase from top to bottom so we reverse the order
        // so that minY in data space maps to graphHeight in svg y-coordinate space
        range: [0, data[1].price * 1.1],
        round: true,
    })
    let svgRef: SVGSVGElement | null = null
    return (
        <div>
            <svg
                ref={(s) => (svgRef = s)}
                width={parentWidth}
                height={parentHeight}
            >
                <LinearGradient
                    id="fill"
                    from="#6086d6"
                    to="#6086d6"
                    fromOpacity={0.2}
                    toOpacity={0}
                />
                <PatternLines
                    id="dLines"
                    height={6}
                    width={6}
                    stroke="#27273f"
                    strokeWidth={1}
                    orientation={["diagonal"]}
                />
                <Group top={margin.top} left={margin.left}>
                    <AxisBottom
                        scale={xScale}
                        top={height}
                        left={margin.left + 18}
                        numTicks={3}
                        hideTicks
                        hideAxisLine
                    />
                    <MaxMinPrice
                        data={maxData}
                        yText={yScale(maxPrice).toString()}
                        label={formatFunc(maxPrice)}
                        max={true}
                    />
                    <AreaClosed
                        stroke="transparent"
                        data={data}
                        yScale={yScale}
                        fill="url(#fill)"
                    />
                    <AreaClosed
                        stroke="transparent"
                        data={data}
                        yScale={yScale}
                        fill="url(#dLines)"
                    />
                    <LinePath
                        data={data}
                        stroke="#6086d6"
                        strokeOpacity="0.8"
                        strokeWidth={1}
                    />
                    <MaxMinPrice
                        data={minData}
                        yText={yScale(minPrice).toString()}
                        label={formatFunc(minPrice)}
                        max={false}
                    />
                    {/* <Bar
                        data={data}
                        width={width}
                        height={height - margin.bottom}
                        fill="transparent"
                        onMouseLeave={(data) => (event) => hideTooltip()}
                        onMouseMove={(data) => (event) => {
                            const { x: xPoint } = localPoint(this.svg, event)
                            const x0 = xScale.invert(xPoint)
                            const index = bisectDate(data, x0, 1)
                            const d0 = data[index - 1]
                            const d1 = data[index]
                            const d =
                                x0 - xScale(x(d0)) > xScale(x(d1)) - x0
                                    ? d1
                                    : d0
                            showTooltip({
                                tooltipData: d,
                                tooltipLeft: xScale(x(d)),
                                tooltipTop: yScale(y(d)),
                            })
                        }}
                    /> */}
                </Group>
                {/* {tooltipData && (
                    <HoverLine
                        from={{
                            x: tooltipLeft,
                            y: yScale(y(maxData[0])),
                        }}
                        to={{
                            x: tooltipLeft,
                            y: yScale(y(minData[0])),
                        }}
                        tooltipLeft={tooltipLeft}
                        tooltipTop={tooltipTop}
                    />
                )} */}
            </svg>
            {/* {tooltipData && (
                <Tooltips
                    yTop={tooltipTop - 12}
                    yLeft={tooltipLeft + 12}
                    yLabel={formatPrice(y(tooltipData))}
                    xTop={yScale(y(minData[0])) + 4}
                    xLeft={tooltipLeft}
                    xLabel={formatDate(x(tooltipData))}
                />
            )} */}
        </div>
    )
}

// export const BitCloutChart: React.FC<BitCloutChartProps> = ({
//     data,
//     domain = ["dataMin", "dataMax"],
// }: BitCloutChartProps) => {
//     return (
//         <Box
//             boxShadow="xs"
//             borderRadius="lg"
//             overflow="hidden"
//             bg="white"
//             d="flex"
//             w="full"
//             pos="relative"
//             height="400px"
//             width="100%"
//             padding={8}
//             marginTop={4}
//         >
//             <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                     data={data}
//                     margin={{
//                         top: 5,
//                         right: 30,
//                         left: 20,
//                         bottom: 5,
//                     }}
//                 >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis
//                         dataKey="timestamp"
//                         label="Date"
//                         type="number"
//                         // scale="time"
//                     />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line
//                         type="monotone"
//                         dataKey="marketBuy"
//                         stroke="#8884d8"
//                         activeDot={{ r: 8 }}
//                     />
//                     <Line
//                         type="monotone"
//                         dataKey="marketSell"
//                         stroke="#82ca9d"
//                     />
//                 </LineChart>
//             </ResponsiveContainer>
//         </Box>
//     )
// }

// export const BitCloutChart: React.FC<BitCloutChartProps> = ({
//     data,
//     domain = ['dataMin', 'dataMax'],
// }: BitCloutChartProps) => {
//     return (
//         <Box
//             boxShadow="xs"
//             maxW="sm"
//             borderRadius="lg"
//             overflow="hidden"
//             bg="white"
//             d="flex"
//             w="full"
//             pos="relative"
//         >
//             <ResponsiveContainer>
//                 <LineChart data={data}>
//                     <XAxis dataKey="date" type="number" domain={domain} />
//                     <YAxis />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="price" stroke="#6494FF" />
//                 </LineChart>
//             </ResponsiveContainer>
//         </Box>
//     )
// }
