/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Box } from '@chakra-ui/react'
import {
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from 'recharts'
import { Depth } from '../../interfaces/Depth'

const tempData = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
]

interface BitCloutChartProps {
    data: [Depth] | never[]
    domain: [string | number, string | number]
}

export const BitCloutChart: React.FC<BitCloutChartProps> = ({
    data,
    domain = ['dataMin', 'dataMax'],
}: BitCloutChartProps) => {
    return (
        <Box
            boxShadow="xs"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            d="flex"
            w="full"
            pos="relative"
            height="400px"
            width="100%"
            padding={8}
            marginTop={4}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="marketBuy"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="marketSell"
                        stroke="#82ca9d"
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    )
}

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
