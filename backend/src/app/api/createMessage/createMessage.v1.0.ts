import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import { HttpException, Exception } from '@/utils/errors';
import logger from '@/libs/logger';
import * as roomService from '@/services/room.service';
import * as messageService from '@/services/message.service';
import * as socketService from '@/services/socket.service';

export default async function createMessage(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const roomName: string = _req.body.roomName;
		const messageText: string = _req.body.content;
		const currentUser = _req.current_user;
		const selectedRoom = await roomService.selectOne(roomName);
		if (!selectedRoom) {
			next(new HttpException(404, 'Room not found'));
			return;
		}
		logger.info('createMessage selectedRoom=%o', selectedRoom.toJSON(), LABEL);
		const createdMessage = await messageService.insertText(currentUser.id, selectedRoom.id, messageText);
		logger.info('createMessage createdMessage=%o', createdMessage.toJSON(), LABEL);
		socketService.emitMessageToAll(selectedRoom.name, currentUser.email.split('@')[0], 'text', messageText);
		res.json({ success: true });
	} catch (error: any) {
		next(error);
	}
}
