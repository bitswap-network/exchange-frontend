export interface User {
    _id: string
    name: string
    email: string
    password: string
    balance: {
        bitclout: number
        ether: number
        in_transaction: boolean
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
        username: string | undefined
    }
    created: Date
    admin: boolean
}
