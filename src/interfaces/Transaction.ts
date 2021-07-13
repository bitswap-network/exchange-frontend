import { User } from "./User";

export interface TransactionSchema {
    _id: string;
    user: User | string;
    transactionType: string;
    assetType: string;
    value: number;
    created: Date;
    completed: boolean;
    completionDate: Date | undefined;
    state: string;
    error: string | null;
    gasDeducted: number | undefined;
    txnHash: string | undefined;
}
