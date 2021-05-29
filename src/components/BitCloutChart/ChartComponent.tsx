/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useMemo } from "react"
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
    LinearGradient,
    appleStock,
    AxisBottom,
    withTooltip,
    localPoint,
    Text,
    scaleTime,
    scaleLinear,
    GridRows,
    GridColumns,
    curveMonotoneX,
} from "@visx/visx"
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip"

import { bisector, extent, max } from "d3-array"
import { format } from "d3-format"
import { MaxMinPrice } from "./MaxMinPrice"

export const background = "#3b6978"
export const background2 = "#204051"
export const accentColor = "#edffea"
export const accentColorDark = "#75daad"
export const formatFunc = format("$,.2f")

interface ChartProps {
    data: DataInterface[]
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

interface DataInterface {
    timestamp: string
    price: number
}

export default withTooltip<ChartProps, DataInterface>(
    ({
        data,
        dateRange = "max",
        parentWidth,
        parentHeight,
        margin = { top: 0, right: 0, bottom: 0, left: 0 },
    }: ChartProps & WithTooltipProvidedProps<DataInterface>) => {
        let svgRef: SVGSVGElement | null = null
        const width = parentWidth - margin.left - margin.right
        const height = parentHeight - margin.top - margin.bottom
        const x = (d: DataInterface) => new Date(d.timestamp)
        const y = (d: DataInterface) => d.price as number

        // const bisectDate = bisector((d) => x(d)).left
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
        const xScale = useMemo(
            () =>
                scaleTime({
                    range: [margin.left, width],
                    domain: extent(data, x) as [Date, Date],
                }),
            [width, margin.left]
        )
        const yScale = useMemo(
            () =>
                scaleLinear({
                    range: [height + margin.top, margin.top],
                    domain: [0, (max(data, y) || 0) + height / 3],
                    nice: true,
                }),
            [margin.top, height]
        )
        console.log("chart", yScale(y(data[50])))
        return (
            <div>
                <svg
                    width={parentWidth}
                    height={parentHeight}
                    ref={(s) => (svgRef = s)}
                >
                    <rect
                        x={0}
                        y={0}
                        width={parentWidth}
                        height={parentHeight}
                        fill="url(#area-background-gradient)"
                        rx={14}
                    />
                    <LinearGradient
                        id="area-background-gradient"
                        from={background}
                        to={background2}
                    />
                    <LinearGradient
                        id="area-gradient"
                        from={accentColor}
                        to={accentColor}
                        toOpacity={0.1}
                    />
                    <GridRows
                        left={margin.left}
                        scale={yScale}
                        width={width}
                        strokeDasharray="1,3"
                        stroke={accentColor}
                        strokeOpacity={0}
                        pointerEvents="none"
                    />
                    <GridColumns
                        top={margin.top}
                        scale={xScale}
                        height={height}
                        strokeDasharray="1,3"
                        stroke={accentColor}
                        strokeOpacity={0.2}
                        pointerEvents="none"
                    />
                    {/* <PatternLines
                    id="dLines"
                    height={6}
                    width={6}
                    stroke="#27273f"
                    strokeWidth={1}
                    orientation={["diagonal"]}
                /> */}
                    {/* <AxisBottom
                        scale={xScale}
                        top={height}
                        left={margin.left + 18}
                        numTicks={3}
                        hideTicks
                        hideAxisLine
                    /> */}
                    {/* <MaxMinPrice
                        data={maxData}
                        yText={yScale(maxPrice).toString()}
                        label={formatFunc(maxPrice)}
                        max={true}
                    /> */}

                    <AreaClosed<DataInterface>
                        // stroke="transparent"
                        innerRef={svgRef}
                        data={data}
                        x={(data) => xScale(x(data)) ?? 50}
                        y={(data) => yScale(x(data)) ?? 50}
                        yScale={yScale}
                        strokeWidth={5}
                        stroke="url(#area-gradient)"
                        fill="url(#FFF)"
                        curve={curveMonotoneX}
                    />
                    {/* <AreaClosed
                    stroke="transparent"
                    data={data}
                    yScale={yScale}
                    fill="url(#dLines)"
                /> */}
                    {/* <LinePath
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
                    /> */}
                    <Bar
                        x={margin.left}
                        y={margin.top}
                        width={width}
                        height={height}
                        fill="transparent"
                        rx={14}
                    />
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
)

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
