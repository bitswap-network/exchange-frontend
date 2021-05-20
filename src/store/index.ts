import { atom, selector } from 'recoil'
import { verifyToken } from '../services/auth'
import { getData, removeData } from '../helpers/persistence'

export const userState = atom({
    key: 'userState',
    default: getData('user'),
})

export const tokenState = selector({
    key: 'access_token',
    get: ({ get }) => {
        const user = get(userState)
        return user.token
    },
})

export const loggedInState = selector({
    key: 'isLoggedIn',
    get: async ({ get }) => {
        const user = get(userState)
        console.log(user)

        if (user) {
            return await verifyToken()
        } else {
            console.log('remove')
            removeData('user')
            return false
        }
    },
})
