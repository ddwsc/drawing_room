import { api } from "@/constants";
import fetch from "@/libs/fetch";

export function create(roomName: string, content: string) {
	return fetch.post(api.createMessage, { roomName, content });
}
