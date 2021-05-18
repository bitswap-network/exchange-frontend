import { atom, selector } from 'recoil'
import { verifyToken } from '../services/auth'

export const saveData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data))
}

export const getData = (key: string) => {
    const data: string | null = localStorage.getItem(key)
    if (data) {
        return JSON.parse(data)
    } else {
        return null
    }
}

export const removeData = (key: string) => {
    localStorage.removeItem(key)
}

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
