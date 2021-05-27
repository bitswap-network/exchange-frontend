import * as identity from './index'
import { depositBitclout } from '../gateway'
import { AxiosResponse } from 'axios'

interface handleBitcloutDepositInterface {
    accessLevel: number
    accessLevelHmac: string
    encryptedSeedHex: string
    transactionHex: string
    transactionIDBase58Check: string
    value: number
}
export const handleBitcloutDeposit = async ({
    accessLevel,
    accessLevelHmac,
    encryptedSeedHex,
    transactionHex,
    transactionIDBase58Check,
    value,
}: handleBitcloutDepositInterface): Promise<AxiosResponse> => {
    return new Promise<AxiosResponse>((resolve, reject) => {
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
                    .then((response) => {
                        resolve(response)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
    })
}
