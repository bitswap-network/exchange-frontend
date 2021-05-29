/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"
import { VictoryAxis, VictoryChart, VictoryLine } from "victory"
import { Box } from "@chakra-ui/react"

export function BitCloutChart({ data }: any) {
    console.log("chart", data)

    return (
        <Box
            boxShadow="xs"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            d="flex"
            w="100%"
            pos="relative"
            marginTop={4}
            padding={4}
        >
            <VictoryChart
                scale={{ x: "time" }}
                padding={{ left: 60, bottom: 50, top: 20, right: 20 }}
            >
                <VictoryLine
                    style={{
                        data: { stroke: "#2e6ded" },
                        parent: { border: "1px solid #ccc" },
                    }}
                    data={data}
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
        </Box>
    )
}
