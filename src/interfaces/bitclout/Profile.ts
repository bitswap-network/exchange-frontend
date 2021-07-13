export interface BitcloutProfile {
    PublicKeyBase58Check: string;
    Username: string;
    Description: string;
    IsHidden: boolean;
    IsReserved: boolean;
    IsVerified: boolean;
    Comments: any;
    Posts: null;
    CoinEntry: any;
    CoinPriceBitCloutNanos: number;
    StakeMultipleBasisPoints: number | null;
    StakeEntryStats: {
        TotalStakeNanos: number;
        TotalStakeOwedNanos: number;
        TotalCreatorEarningsNanos: number;
        TotalFeesBurnedNanos: number;
        TotalPostStakeNanos: number;
    };
    UsersThatHODL: any;
}
