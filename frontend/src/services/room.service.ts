import { api } from "@/constants";
import fetch from "@/libs/fetch";

export const searchTextMinLength = 3;

export function list(searchText?: string, currentPage?: number) {
	const options = {
		params: {
			...(searchText && { name: searchText }),
			...(currentPage && { page: currentPage }),
		},
	};
	return fetch.get(api.listRoom, options);
}

export function create() {
	return fetch.post(api.createRoom);
}

export function join(roomName: string) {
	const url = api.joinRoom.replace(':roomName', roomName);
	return fetch.post(url);
}
