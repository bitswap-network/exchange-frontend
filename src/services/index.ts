import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getData } from "../helpers/persistence";
import { api } from "../globalVars";

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    // console.error(`[request error] [${JSON.stringify(error)}]`)
    return Promise.reject(error);
};

const onAuthRequest = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    const token = getData("token");
    if (token) {
        config.headers["x-access-token"] = token;
    }
    return config;
};

const onAuthRequestError = (error: AxiosError): Promise<AxiosError> => {
    // console.error(`[request error] [${JSON.stringify(error)}]`)
    return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    // console.error(`[response error] [${JSON.stringify(error)}]`)
    return Promise.reject(error);
};

const client = axios.create({
    baseURL: api,
});
const authClient = axios.create({
    baseURL: api,
});

client.interceptors.request.use(onRequest, onRequestError);
client.interceptors.response.use(onResponse, onResponseError);
authClient.interceptors.request.use(onAuthRequest, onAuthRequestError);
authClient.interceptors.response.use(onResponse, onResponseError);

export { client, authClient };
