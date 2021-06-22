export interface IdentityUsers {
    [index: string]: IdentityUser;
}

export interface IdentityUser {
    hasExtraText: boolean;
    btcDepositAddress: string;
    encryptedSeedHex: string;
    network: string;
    accessLevel: number;
    accessLevelHmac: string;
}
