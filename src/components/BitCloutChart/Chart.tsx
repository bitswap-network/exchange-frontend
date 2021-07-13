/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState, useMemo } from "react";
import { Box, Skeleton, Text } from "@chakra-ui/react";
import { ResponsiveLine } from "@nivo/line";
import { ChartData as ChartDataInterface } from "../../interfaces/Depth";
import { getOrderHistory } from "../../services/utility";
import { ParentSize } from "@visx/responsive";

const graphTheme = {
    fontSize: "12px",
    textColor: "#495057",
    fontFamily: "Inter",
    axis: {
        legend: {
            text: {
                fontWeight: "bold",
                fontSize: "13px",
            },
        },
    },
};

interface ChartProps {
    ticks: number;
    dateTicks: number;
}

export const Chart: React.FC<ChartProps> = ({ ticks, dateTicks }: ChartProps) => {
    interface hotData {
        timestamp: Date;
        price: number;
    }

    const [depthHot, setDepthHot] = useState<[]>([]);
    const [loading, setLoading] = useState(true);
    const [minY, setMinY] = useState(0);
    const [maxY, setMaxY] = useState(0);
    const [dateTickValues, setDateTickValues] = useState<Date[]>([new Date()]);

    useEffect(() => {
        getOrderHistory().then((response) => {
            setDepthHot(response.data);
            setLoading(false);
        });
    }, []);

    const parseData = (dataList: []) => {
        const parsedDataArr: ChartDataInterface = {
            id: "CLOUT Market Price",
            data: [],
        };
        let min = 1000;
        let max = 0;
        let minDate = new Date();
        minDate.setDate(minDate.getDate() + 100);
        let maxDate = new Date(0);
        dataList.forEach((item: hotData) => {
            const date = new Date(item.timestamp);
            parsedDataArr.data.push({
                x: `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`,
                y: item.price,
            });
            if (date < minDate) {
                minDate = date;
            }
            if (date > maxDate) {
                maxDate = date;
            }
            min = Math.min(min, item.price - 30);
            max = Math.max(max, item.price + 30);
        });
        const dateRange = (maxDate - minDate) / (1000 * 60 * 60 * 24);
        const dateInterval = Math.ceil(dateRange / dateTicks);
        const datesArray = [];
        for (let i = 0; i < dateTicks; i++) {
            if (new Date(minDate.getUTCMonth() + 1 + " " + minDate.getUTCDate() + ", " + minDate.getUTCFullYear()) <= maxDate) {
                datesArray.push(new Date(minDate.getUTCMonth() + 1 + " " + minDate.getUTCDate() + ", " + minDate.getUTCFullYear()));
                minDate.setDate(minDate.getUTCDate() + dateInterval);
            }
        }
        setDateTickValues(datesArray);
        setMinY(min);
        setMaxY(max);

        return parsedDataArr;
    };

    const depthMemo = useMemo(() => parseData(depthHot), [depthHot]) as ChartDataInterface;

    return (
        <ParentSize>
            {(parent) => (
                <Box overflow="visible" w={parent.width} pos="relative">
                    <Skeleton startColor="gray.100" endColor="gray.300" isLoaded={!loading} w="full" height={parent.width * 0.55}>
                        <ResponsiveLine
                            theme={graphTheme}
                            data={[depthMemo]}
                            colors={"#407BFF"}
                            tooltip={(point) => {
                                const date = new Date(point.point.data.x).toString().split(" ");
                                return (
                                    <Box bgColor="white" borderRadius="lg" p="2" boxShadow="lg" fontSize="x-small" textAlign="center" borderStyle="groove">
                                        <Text fontSize="sm" color="brand.100" fontWeight="bold">
                                            {"$" + point.point.data.y}
                                        </Text>
                                        <Text>{date[1] + " " + date[2] + " " + date[3]}</Text>
                                    </Box>
                                );
                            }}
                            margin={{
                                left: 50,
                                right: 20,
                                bottom: 45,
                                top: 10,
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
                                tickPadding: 5,
                                tickRotation: 0,
                            }}
                            axisBottom={{
                                format: "%m/%d",
                                tickValues: dateTickValues,
                                legend: "Date",
                                legendOffset: 30,
                                tickPadding: 5,
                                tickSize: 0,
                                legendPosition: "middle",
                            }}
                            curve={"catmullRom"}
                            areaBaselineValue={minY}
                            enablePointLabel={false}
                            pointSize={0}
                            useMesh={true}
                            enableSlices={false}
                            animate={true}
                            enableGridX={false}
                            enableGridY={true}
                            gridYValues={5}
                            enableArea={true}
                            areaOpacity={0.9}
                            defs={[
                                {
                                    id: "themeGradient",
                                    type: "linearGradient",
                                    colors: [
                                        { offset: 25, color: "#407BFF", opacity: 1 },
                                        { offset: 100, color: "#FFFFFF", opacity: 0 },
                                    ],
                                },
                            ]}
                            fill={[{ match: "*", id: "themeGradient" }]}
                            colorBy={"id"}
                            lineWidth={1.5}
                        />
                    </Skeleton>
                </Box>
            )}
        </ParentSize>
    );
};
