import { atom, selector } from 'recoil'
import { verifyToken } from '../services/auth'
import { getData, removeData, saveData } from '../helpers/persistence'

export const userState = atom({
    key: 'userState',
    default: getData('user'),
})

export const tokenState = atom({
    key: 'tokenState',
    default: getData('token'),
})

export const loggedInState = selector({
    key: 'isLoggedIn',
    get: async ({ get }) => {
        const user = get(userState)
        console.log(user)
        if (user) {
            return await verifyToken()
        } else {
            removeData('user')
            removeData('token')
            window.location.assign('/login')
            return false
        }
    },
})

export const identityUsers = atom({
    key: 'identityUsers',
    default: getData('identityUsers'),
})
export const currentPublicKey = atom({
    key: 'publicKey',
    default: getData('publicKey'),
})
