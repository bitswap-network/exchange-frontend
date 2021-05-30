/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react"
import { VictoryAxis, VictoryChart, VictoryLine } from "victory"
import { ChartData as ChartDataInterface } from "../../interfaces/Depth"
import { getDepth } from "../../services/utility"

export function BitCloutChart({ data }: any) {
    const [depth, setDepth] = useState<ChartDataInterface[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDepth("max").then((depthResponse) => {
            const parsedCopy: ChartDataInterface[] = []
            depthResponse.data.data.forEach((depthItem: DepthInterface) => {
                parsedCopy.push({
                    timestamp: new Date(depthItem.timestamp),
                    price: (depthItem.marketSell + depthItem.marketBuy) / 2,
                })
            })
            console.log("parsed depth", parsedCopy)
            setDepth(parsedCopy)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return null
    }

    return (
        <VictoryChart
            scale={{ x: "time" }}
            padding={{ left: 60, bottom: 50, top: 20, right: 20 }}
        >
            <VictoryLine
                style={{
                    data: { stroke: "#2e6ded" },
                    parent: { border: "1px solid #ccc" },
                }}
                data={depth}
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
                domain={[50, 150]}
            />
            <VictoryAxis
                label="Date"
                style={{
                    axisLabel: {
                        padding: 30,
                    },
                }}
            />
        </VictoryChart>
    )
}