/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"
import Chart, { formatFunc } from "./ChartComponent"
import { ChartData } from "../../interfaces/Depth"

interface BitCloutChartInterface {
    data: ChartData[]
    width: number
    height: number
    dateRange: string
}

export function BitcloutChart({
    data,
    width,
    height,
    dateRange,
}: BitCloutChartInterface) {
    console.log(width, height)
    const prices = data.map((k: any) => ({
        timestamp: k.timestamp,
        price: (k.marketBuy + k.marketSell) / 2,
    }))

    const currentPrice = prices[prices.length - 1].price
    const firstPrice = prices[0].price
    const diffPrice = currentPrice - firstPrice
    const hasIncreased = diffPrice > 0

    const dateRangeFormat = (dateRange: string) => {
        switch (dateRange) {
            case "max":
                return "Entire history"
            case "1m":
                return "Last 30 days"
            case "1w":
                return "Last 7 days"
            case "1d":
                return "Last 24 hours"
        }
    }

    return (
        // <div>
        // <div>
        //     <div>
        //         Bitcoin Price
        //         <br />
        //         <small>{dateRangeFormat(dateRange)}</small>
        //     </div>
        //     <div />
        //     <div>
        //         <div>{formatFunc(currentPrice)}</div>
        //         <div
        //             className={
        //                 hasIncreased ? "diffIncrease" : "diffDecrease"
        //             }
        //         >
        //             {hasIncreased ? "+" : "-"}
        //             {formatFunc(diffPrice)}
        //         </div>
        //     </div>
        // </div>
        // <div>
        <Chart
            data={prices}
            parentWidth={width * 0.9}
            parentHeight={height * 0.6}
            margin={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        />
        // </div>
        // </div>
    )
}
