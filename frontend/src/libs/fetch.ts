import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { api } from "@/constants";

const fetch = axios.create();

fetch.defaults.baseURL = api.base;
// fetch.defaults.timeout = 10 * 1000;
fetch.defaults.withCredentials = true;
fetch.interceptors.request.use(beforeRequest, handleRequestError);
fetch.interceptors.response.use(afterResponse, handleResponseError);

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

function beforeRequest(config: any) {
	return config;
}

function handleRequestError(error: AxiosError) {
	return Promise.reject(error);
}

export function afterResponse(response: AxiosResponse) {
	return response;
}

async function handleResponseError(error: AxiosError) {
	if (error.response && error.response.status === 403) {
		const originalRequest = error.config as CustomAxiosRequestConfig;
		if (originalRequest && !originalRequest._retry) {
			originalRequest._retry = true;
			const option: CustomAxiosRequestConfig = {
				_retry: true,
			};
			const refreshed = await fetch.get(api.refresh, option);
			if (refreshed) {
				return fetch(originalRequest);
			}
		}
	}
	return Promise.reject(error);
}

export function handleResponseError403(error: any, callback: Function) {
	if (error.response && error.response.status === 403) {
		return callback();
	}
	return Promise.reject(error);
}

export default fetch;
