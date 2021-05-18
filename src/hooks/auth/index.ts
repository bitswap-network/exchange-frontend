import axios from 'axios'
import { api } from '../../config.json'

export const login = async (username: string, password: string) => {
    return await axios.post(`${api}/auth/login`, {
        username: username,
        password: password,
    })
}
