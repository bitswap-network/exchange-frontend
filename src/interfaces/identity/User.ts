export interface IdentityUser {
    [index: string]: {
        hasExtraText: boolean
        btcDepositAddress: string
        encryptedSeedHex: string
        network: string
        accessLevel: number
        accessLevelHmac: string
    }
}
