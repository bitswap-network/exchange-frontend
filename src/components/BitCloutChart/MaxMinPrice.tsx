import React from "react"
import { LinePath, Group, Text, scaleLinear, scaleTime } from "@visx/visx"

interface MaxMinPriceInterface {
    data: any[]
    label: string
    yText: string
    // yScale: typeof scaleLinear
    // xScale: typeof scaleTime
    // x: number
    // y: number
    max: boolean
}

export const MaxMinPrice = ({
    data,
    label,
    yText,
    // yScale,
    // xScale,
    // x,
    // y,
    max,
}: MaxMinPriceInterface) => {
    return (
        <Group>
            <LinePath
                data={data}
                stroke="#6086d6"
                strokeWidth={1}
                strokeDasharray="4,4"
                strokeOpacity=".3"
            />
            <Text
                fill="#6086d6"
                y={yText}
                dy={max ? "1.3em" : "-.5em"}
                dx="10px"
                fontSize="12"
            >
                {label}
            </Text>
        </Group>
    )
}
