export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    tier: number;
    balance: {
        bitclout: number;
        ether: number;
        in_transaction: boolean;
    };
    transactions: string[];
    verification: {
        email: boolean;
        emailString: string;
        personaAccountId: string | null;
        inquiryId: string | null;
        personaVerified: boolean;
    };
    bitclout: {
        publicKey: string;
        bio: string | undefined;
        verified: boolean;
        username: string | undefined;
    };
    created: Date;
    admin: boolean;
}
