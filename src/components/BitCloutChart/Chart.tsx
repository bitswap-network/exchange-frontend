/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"
import { Chart, formatFunc } from "./ChartComponent"
import Style from "styled-jsx"

interface BitCloutChartInterface {
    data: { timestamp: Date; marketBuy: number; marketSell: number }[]
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
        <div className="bitcoin">
            <div className="title">
                <div>
                    Bitcoin Price
                    <br />
                    <small>{dateRangeFormat(dateRange)}</small>
                </div>
                <div className="spacer" />
                <div className="stats">
                    <div className="current">{formatFunc(currentPrice)}</div>
                    <div
                        className={
                            hasIncreased ? "diffIncrease" : "diffDecrease"
                        }
                    >
                        {hasIncreased ? "+" : "-"}
                        {formatFunc(diffPrice)}
                    </div>
                </div>
            </div>
            <div className="chart">
                <Chart
                    data={prices}
                    parentWidth={width * 0.6}
                    parentHeight={height * 0.45}
                    margin={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 45,
                    }}
                />
            </div>
            <style jsx>{`
                .bitcoin {
                    color: white;
                    background-color: #27273f;
                    border-radius: 6px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
                    display: flex;
                    flex-direction: column;
                }
                .duration {
                    font-weight: 100 !important;
                    font-size: 14px;
                    padding-bottom: 1px;
                    border-bottom: 2px solid #6086d6;
                }
                .title,
                .stats {
                    padding: 15px 15px 0;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .title small {
                    color: #6086d6;
                }
                .stats {
                    padding: 0px;
                    justify-content: flex-end;
                    align-items: flex-end;
                    flex-direction: column;
                }
                .current {
                    font-size: 24px;
                }
                .diffIncrease,
                .diffDecrease {
                    font-size: 12px;
                    margin-left: 0.5rem;
                }
                .diffIncrease {
                    color: #00f1a1;
                }
                .spacer {
                    display: flex;
                    flex: 1;
                }
                .chart {
                    display: flex;
                    flex: 1;
                }
            `}</style>
        </div>
    )
}
