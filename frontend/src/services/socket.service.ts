import io from "socket.io-client";
import { socket as config } from "@/constants";

export function open() {
	const socket = io(config.base, {
		path: config.path,
		withCredentials: true,
	});

	socket.on("connect", () => {
		console.log(Date.now(), 'connect');
	});

	socket.on("connect_error", (err: unknown) => {
		console.error(Date.now(), 'connect_error', err);
	});

	socket.on("disconnect", (err: unknown) => {
		console.error(Date.now(), 'disconnect', err);
	});

	return socket;
}
