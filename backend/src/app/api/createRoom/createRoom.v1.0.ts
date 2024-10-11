import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import { HttpException, Exception } from '@/utils/errors';
import logger from '@/libs/logger';
import * as roomService from '@/services/room.service';

export default async function createRoom(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const currentUser = _req.current_user;
		const userInRoom = await roomService.selectInAllRoom(currentUser.id);
		if (userInRoom) {
			logger.info('createRoom userInRoom=%o', userInRoom.toJSON(), LABEL);
			next(new HttpException(409, 'User is in another room'));
			return;
		}
		const createdRoom = await roomService.insert();
		logger.info('createRoom createdRoom=%o', createdRoom.toJSON(), LABEL);
		res.json({ room: { name: createdRoom.name } });
	} catch (error: any) {
		next(error);
	}
}
