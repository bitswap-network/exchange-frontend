import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios'
import { getData } from '../helpers/persistence'
import { api } from '../config'

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    console.info(`[request] [${JSON.stringify(config)}]`)
    return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`)
    return Promise.reject(error)
}

const onAuthRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    const user = getData('user')
    if (user.token) {
        config.headers['Authorization'] = 'Bearer ' + user.token
    }
    console.info(`[request] [${JSON.stringify(config)}]`)
    return config
}

const onAuthRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`)
    return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    console.info(`[response] [${JSON.stringify(response)}]`)
    return response
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[response error] [${JSON.stringify(error)}]`)
    return Promise.reject(error)
}

const client = axios.create({
    baseURL: api,
})
const authClient = axios.create({
    baseURL: api,
})

client.interceptors.request.use(onRequest, onRequestError)
client.interceptors.response.use(onResponse, onResponseError)
authClient.interceptors.request.use(onAuthRequest, onAuthRequestError)
authClient.interceptors.response.use(onResponse, onResponseError)

export { client, authClient }
