import { api } from "@/constants";
import fetch from "@/libs/fetch";

export function access() {
	return fetch.get(api.access);
}

export function refresh() {
	return fetch.get(api.refresh);
}

export function signIn(email: string, password: string) {
	return fetch.post(api.signIn, { email, password });
}

export function signOut() {
	return fetch.post(api.signOut);
}

export function signUp(email: string, password: string) {
	return fetch.post(api.signUp, { email, password });
}

export function forgotPassword(email: string) {
	return fetch.post(api.forgotPassword, { email });
}

export function changePassword(token: string, password: string) {
	const url = api.changePassword.replace(':token', token);
	return fetch.post(url, { password });
}
