import { getInstance } from '@/app/socket/server';
import config from '@/configs/env';

export function emitCountMembersToAll(roomName: string, totalMembers: number) {
	const io = getInstance();
	if (io) {
		console.log('emitCountMembersToAll %o %o', roomName, totalMembers);
		io.emit(config.socket.event.roomMembers, { roomName, totalMembers });
	}
}

export function emitMessageToAll(roomName: string, username: string, type: string, content: string) {
	const io = getInstance();
	if (io) {
		console.log('emitMessageToAll %o %o %o %o', roomName, username, type, content);
		io.emit(config.socket.event.roomMessages, { roomName, username, type, content});
	}
}
