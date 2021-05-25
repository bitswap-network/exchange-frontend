import * as identity from './index'
import { depositBitclout } from '../gateway'

interface handleBitcloutDepositInterface {
    accessLevel: number
    accessLevelHmac: string
    encryptedSeedHex: string
    transactionHex: string
    transactionIDBase58Check: string
    value: number
}
export const handleBitcloutDeposit = ({
    accessLevel,
    accessLevelHmac,
    encryptedSeedHex,
    transactionHex,
    transactionIDBase58Check,
    value,
}: handleBitcloutDepositInterface) => {
    identity
        .sign({
            accessLevel: accessLevel,
            accessLevelHmac: accessLevelHmac,
            encryptedSeedHex: encryptedSeedHex,
            transactionHex: transactionHex,
        })
        .subscribe((response) => {
            depositBitclout(
                response.signedTransactionHex,
                transactionIDBase58Check,
                value
            )
        })
}
