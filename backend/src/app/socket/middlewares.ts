import { Socket } from 'socket.io';
import logger from '@/libs/logger';
import config from "@/configs/env";
import * as tokenService from '@/services/token.service';
import * as cacheService from '@/services/cache.service';
import * as roomService from '@/services/room.service';
import { IUserCacheData } from '@/interfaces/user.interface';

export const onConnection = (socket: Socket) => {
	const LABEL = { label: socket.id };
	logger.info('Client connected', LABEL);

	socket.on('disconnect', async (err) => {
		try {
			const currentUser = (socket as any).currentUser;
			logger.info('socketDisconnect user=%o', currentUser, LABEL);
			const userInRoom = await roomService.selectInAllRoom(currentUser.id);
			if (userInRoom) {
				logger.info('socketDisconnect userInRoom=%o', userInRoom.toJSON(), LABEL);
				await roomService.leaveRoom(userInRoom.userId, userInRoom.roomId);
			}
		} catch (error) {
			logger.info('socketDisconnect error=%o', error, LABEL);
		}

	});
};

export const validateSocketToken = async (socket: Socket, next: any) => {
	const LABEL = { label: socket.id };
	try {
		const refreshToken = socket.handshake.headers.cookie
			?.split('; ')
			.find(c => c.startsWith('refreshToken='))
			?.split('=')[1];
		logger.info('validateSocketToken refreshToken=%o', refreshToken, LABEL);
		if (!refreshToken) return next(new Error('SocketAuthentication: Invalid token'));
		tokenService.verify(refreshToken);
		const cacheData: IUserCacheData = await cacheService.select(refreshToken);
		logger.info('validateSocketToken cacheData=%o', cacheData, LABEL);
		(socket as any).currentUser = {
			id: cacheData.id,
			email: cacheData.email,
		};
		next();
	} catch (error) {
		return next(new Error('SocketAuthentication: Invalid token'));
	}
};
