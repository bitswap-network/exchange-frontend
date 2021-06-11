export interface User {
    _id: string
    name: string
    email: string
    password: string
    balance: {
        bitclout: number
        ether: number
        in_transaction: boolean | undefined
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
        bio: string
        verified: boolean
        profilePicture: string
        username: string
    }
    created: Date
    admin: boolean
}
