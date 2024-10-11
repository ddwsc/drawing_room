import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import { HttpException, Exception } from '@/utils/errors';
import { IJoinRoomItem } from '@/interfaces/room.interface';
import config from '@/configs/env';
import logger from '@/libs/logger';
import * as roomService from '@/services/room.service';
import * as socketService from '@/services/socket.service';
// import * as cacheService from '@/services/cache.service';

export default async function joinRoom(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		// const refreshToken = req.cookies.refreshToken;
		const roomName: string = _req.params.roomName;
		const currentUser = _req.current_user;
		const selectedRoom = await roomService.selectOne(roomName);
		if (!selectedRoom) {
			next(new HttpException(404, 'Room not found'));
			return;
		}
		logger.info('joinRoom selectedRoom=%o', selectedRoom.toJSON(), LABEL);
		let userInThisRoom = false;
		const userInAllRoom = await roomService.selectInAllRoom(currentUser.id);
		if (userInAllRoom) {
			logger.info('joinRoom userInAllRoom=%o', userInAllRoom.toJSON(), LABEL);
			if (selectedRoom.id !== userInAllRoom.roomId) {
				next(new HttpException(409, 'User is in another room'));
				return;
			}
			userInThisRoom = true;
		}
		const activeUsers = await roomService.selectActiveRoomMembers(selectedRoom.id);
		logger.info('joinRoom activeUsers=%o', activeUsers.length, LABEL);
		if (activeUsers.length >= config.api.room.maxUsers) {
			logger.info('joinRoom limit exceed %d/%d', activeUsers.length, config.api.room.maxUsers, LABEL);
			next(new HttpException(409, 'Room is full'));
			return;
		}
		const joined = await roomService.joinRoom(currentUser.id, selectedRoom.id);
		logger.info('joinRoom joined=%o', joined.toJSON(), LABEL);
		let countActiveUsers = activeUsers.length;
		if (!userInThisRoom) {
			countActiveUsers = activeUsers.length + 1;
			socketService.emitCountMembersToAll(selectedRoom.name, countActiveUsers);
		}
		const resData: IJoinRoomItem = {
			room: {
				name: selectedRoom.name,
				members: countActiveUsers
			}
		}
		res.json(resData);
	} catch (error: any) {
		next(error);
	}
}
