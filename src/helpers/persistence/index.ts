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
