import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { IRequest } from '@/interfaces/app.interface';
import { IFileCacheData } from '@/interfaces/file.interface';
import { HttpException, Exception } from '@/utils/errors';
import logger from '@/libs/logger';
import config from '@/configs/env';
import * as roomService from '@/services/room.service';
import * as messageService from '@/services/message.service';
import * as socketService from '@/services/socket.service';
import * as cacheService from '@/services/cache.service';
import * as storageService from '@/services/storage.service';

const apiFileV1_0 = config.domain.back + '/api/v1.0/file/:filename';

export default async function createFileMessage(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const filename = _req.file?.filename || '';
		const fileTitle = filename.split('.')[0];
		const filePath = _req.file?.path || '';
		logger.info('createFileMessage file title=%o path=%o', fileTitle, filePath, LABEL);
		const roomName: string = _req.body.roomName;
		const currentUser = _req.current_user;
		const selectedRoom = await roomService.selectOne(roomName);
		if (!selectedRoom) {
			next(new HttpException(404, 'Room not found'));
			return;
		}
		logger.info('createFileMessage selectedRoom=%o', selectedRoom.toJSON(), LABEL);
		const cloudPath = storageService.bucketFilePath(filePath);
		const createdMessage = await messageService.insertFile(currentUser.id, selectedRoom.id, cloudPath);
		logger.info('createFileMessage createdMessage=%o', createdMessage.toJSON(), LABEL);
		const cacheData: IFileCacheData = { localPath: filePath, cloudPath };
		await cacheService.insertFileAccess(fileTitle, cacheData);
		logger.info('createFileMessage cacheData=%o', cacheData, LABEL);
		const getFileUrl = apiFileV1_0.replace(':filename', fileTitle)
		socketService.emitMessageToAll(selectedRoom.name, currentUser.email.split('@')[0], 'file', getFileUrl);
		res.json({ success: true });
	} catch (error: any) {
		next(error);
	}
}
