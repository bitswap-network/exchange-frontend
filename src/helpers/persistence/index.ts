import { IdentityUser } from '../../interfaces/identity/User'
export const saveData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data))
}

export const getData = (key: string) => {
    const data: string | null = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
}

export const removeData = (key: string) => {
    localStorage.removeItem(key)
}

export const setIdentityUsers = (users: IdentityUser) => {
    saveData('identityUsers', users)
}
