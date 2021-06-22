export interface Depth {
    timestamp: Date;
    marketBuy: number;
    marketSell: number;
    asks: { price: number; quantity: number }[];
    bids: { price: number; quantity: number }[];
}

export interface ChartDataPoint {
    x: number | string | Date;
    y: number | string | Date;
}

export interface ChartData {
    id: string | number;
    data: ChartDataPoint[];
}
