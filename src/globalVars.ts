import { useEffect, useRef } from "react";

export const isTest = process.env.REACT_APP_ENVIRONMENT === "production" ? false : true;

export const api = isTest ? "https://bitswap-core-api-staging.herokuapp.com/" : "https://api.bitswap.network/";
export const identityURL = "https://identity.bitclout.com";

export const etherscanPrefix = isTest ? "kovan." : "";

export const BITCLOUT = "CLOUT";
export const ETHER = "ETH";
export const USDC = "USDC";

export const UNVERIFIED_MAX_USD_LIMIT = 2000;
export const UNVERIFIED_WITHDRAW_LIMIT = 2000;
export const BITCLOUT_LOGO = "./bitcloutLogo.png";
export const ETHER_LOGO = "./etherLogo.png";
export const USDC_LOGO = "./usdcLogo.png";

export const MAX_LIMIT = 1000;
export const MIN_LIMIT = 0.01;
export const ROUNDING_PRECISION = 6;

export const parseNum = (val: string) => val.replace(/^\$/, "");

const epochs: [string, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
];

export function timeSince(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const interval = epochs.find((i) => i[1] < seconds);
    const count = interval ? Math.floor(seconds / interval[1]) : null;
    return interval && count ? `${count} ${interval[0]}${count !== 1 ? "s" : ""} ago` : "<1 second ago";
}

export const formatBalanceSmall = (balance: number) => {
    return +balance?.toFixed(2);
};
export const formatBalanceLarge = (balance: number) => {
    return +balance?.toFixed(ROUNDING_PRECISION);
};

export const formateDateTime = (date: Date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const capFirst = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
export const zip = (a1: Array<any>, a2: Array<any>) => a1.map((x, i) => [x, a2[i]]);

export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    // Remember the latest callback if it changes.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        if (delay === null) {
            return;
        }

        const id = setInterval(() => savedCallback.current(), delay);

        return () => clearInterval(id);
    }, [delay]);
}
