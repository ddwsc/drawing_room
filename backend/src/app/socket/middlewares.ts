import { Socket } from 'socket.io';
import logger from '@/libs/logger';
import config from '@/configs/env';
import * as tokenService from '@/services/token.service';
import * as cacheService from '@/services/cache.service';
import * as roomService from '@/services/room.service';
import { IUserCacheData } from '@/interfaces/user.interface';
import { execRefreshCookie } from '@/helpers/cookie';
import { ISocket } from '@/interfaces/socket.interface';

export const onConnection = (_socket: Socket) => {
	const socket = _socket as ISocket;
	const LABEL = { label: socket.id };
	const userEmail = socket.currentSession.userEmail;
	const roomName = socket.currentSession.roomName;

	try {
		socket.join(roomName);
		roomService
			.joinRoom(socket.currentSession.userId, socket.currentSession.roomId)
			.then(() => {
				logger.info('onConnection user=%o join room=%o', userEmail, roomName, LABEL);
				return roomService.selectActiveRoomMembers(socket.currentSession.roomId);
			})
			.then(activeUsers => {
				logger.info('onConnection emitCountMembersToAll room=%o %o', roomName, activeUsers.length, LABEL);
				socket.to(roomName).emit(config.socket.event.roomMembers, { roomName, totalMembers: activeUsers.length });
			});
	} catch (error) {
		logger.info('user=%o room=%o error=%o', error, LABEL);
	}

	socket.on('disconnect', async err => {
		try {
			await roomService.leaveRoom(socket.currentSession.userId, socket.currentSession.roomId);
			logger.info('onDisconnect user=%o leave room=%o', userEmail, roomName, LABEL);
			const activeUsers = await roomService.selectActiveRoomMembers(socket.currentSession.roomId);
			if (activeUsers.length) {
				logger.info('onDisconnect emitCountMembersToAll room=%o %o', roomName, activeUsers.length, LABEL);
				socket.to(roomName).emit(config.socket.event.roomMembers, { roomName, totalMembers: activeUsers.length });
			}
		} catch (error) {
			logger.info('user=%o room=%o error=%o', error, LABEL);
		}
	});
};

export const validateSocketToken = async (socket: Socket, next: any) => {
	const LABEL = { label: socket.id };
	try {
		const roomName = socket.handshake.query.roomName as string;
		if (!roomName) return next(new Error('SocketAuthentication: Invalid room'));
		const selectedRoom = await roomService.selectOne(roomName);
		if (!selectedRoom) return next(new Error('SocketAuthentication: Invalid room'));
		logger.info('validateSocketToken selectedRoom=%o', selectedRoom.toJSON(), LABEL);
		const refreshToken = execRefreshCookie(socket.handshake.headers.cookie as string);
		if (!refreshToken) return next(new Error('SocketAuthentication: Invalid token'));
		tokenService.verify(refreshToken);
		const cacheData: IUserCacheData = await cacheService.select(refreshToken);
		logger.info('validateSocketToken cacheData=%o', cacheData, LABEL);
		(socket as any).currentSession = {
			userId: cacheData.id,
			userEmail: cacheData.email,
			roomId: selectedRoom.id,
			roomName: selectedRoom.name,
		};
		next();
	} catch (error) {
		return next(new Error('SocketAuthentication: Invalid token'));
	}
};
