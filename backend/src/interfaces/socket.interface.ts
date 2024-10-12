import { Socket } from 'socket.io';

export interface ISocket extends Socket {
	currentSession: {
		userId: number;
		userEmail: string;
		roomId: number;
		roomName: string;
	}
}
