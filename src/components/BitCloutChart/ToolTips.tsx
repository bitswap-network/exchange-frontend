import React from "react"

import { Tooltip } from "@visx/visx"

interface ToolTipInterface {
    yTop: number
    yLeft: number
    yLabel: string
    xTop: number
    xLeft: number
    xLabel: string
}

export const ToolTips = ({
    yTop,
    yLeft,
    yLabel,
    xTop,
    xLeft,
    xLabel,
}: ToolTipInterface) => {
    return (
        <div>
            <Tooltip
                top={xTop}
                left={xLeft}
                style={{
                    transform: "translateX(-50%)",
                }}
            >
                {xLabel}
            </Tooltip>
            <Tooltip
                top={yTop}
                left={yLeft}
                style={{
                    backgroundColor: "rgba(92, 119, 235, 1.000)",
                    color: "white",
                }}
            >
                {yLabel}
            </Tooltip>
        </div>
    )
}
