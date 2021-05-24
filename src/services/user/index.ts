import { authClient } from '../index'

export const getUserData = async () => {
    return await authClient.get('/user/data')
}
export const getUserProfile = async (username: string) => {
    return await authClient.get(`/user/profile/${username}`)
}

export const updateProfile = async (email: string, name: string) => {
    return await authClient.put(`/user/update-profile`, {
        email: email,
        name: name,
    })
}

export const resendVerificationEmail = async (email: string, name: string) => {
    return await authClient.get(`/user/resend-verification`)
}

export const verifyBitclout = async (depth?: number) => {
    return await authClient.get(`/user/verify-bitclout/${depth ? depth : 10}`)
}
