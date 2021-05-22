import { TransactionSchema } from './Transaction'

export interface User {
    _id: string
    username: string
    email: string
    password: string
    balance: {
        bitclout: number
        ether: number
    }
    transactions: string[]
    verification: {
        email: boolean
        emailString: string
        passwordString: string
        status: string
        bitcloutString: string
    }
    bitclout: {
        publicKey: string
        bio: string | undefined
        verified: boolean
        profilePicture: string | undefined
    }
    created: Date
    admin: boolean
}
