import { client, authClient } from '../index'

export const verifyToken = async () => {
    try {
        const response = await authClient.post('/auth/verifytoken')
        return response.status === 204
    } catch (e) {
        console.error(e)
        return false
    }
}

export const login = (publicKey: string, identityJWT: string) => {
    return client.post('/auth/login', {
        publicKey: publicKey,
        identityJWT: identityJWT,
    })
}

export const register = (publicKey: string, email: string, name: string) => {
    return client.put('/auth/register', {
        publicKey: publicKey,
        email: email,
        name: name,
    })
}
