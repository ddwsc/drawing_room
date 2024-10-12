import { getInstance } from '@/app/socket/server';
import config from '@/configs/env';
import logger from '@/libs/logger';

export function emitCountMembersToAll(roomName: string, totalMembers: number) {
	const io = getInstance();
	if (io) {
		logger.info('emitCountMembersToAll room=%o %o', roomName, totalMembers);
		io.to(roomName).emit(config.socket.event.roomMembers, { roomName, totalMembers });
	}
}

export function emitMessageToAll(roomName: string, username: string, type: string, content: string) {
	const io = getInstance();
	if (io) {
		logger.info('emitMessageToAll room=%o %o %o %o', roomName, username, type, content);
		io.to(roomName).emit(config.socket.event.roomMessages, { roomName, username, type, content});
	}
}
