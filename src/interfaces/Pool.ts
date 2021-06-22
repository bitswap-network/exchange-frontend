import { User } from "./User";

export interface Pool {
    _id: string;
    address: string;
    privateKey: {
        salt: string;
        encryptedKey: string;
    };
    active: boolean;
    activeStart: number | null;
    user: User | string | null;
    super: number;
    balance: number;
}
