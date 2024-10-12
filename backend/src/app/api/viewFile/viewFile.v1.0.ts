import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import { IFileCacheData } from '@/interfaces/file.interface';
import { HttpException } from '@/utils/errors';
import logger from '@/libs/logger';
import * as cacheService from '@/services/cache.service';
import * as storageService from '@/services/storage.service';

export default async function viewFile(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const fileTitle = _req.params.title as string;
		logger.info('viewFile file title=%o', fileTitle, LABEL);
		const cacheData: IFileCacheData = await cacheService.select(fileTitle);
		logger.info('viewFile cacheData=%o', cacheData, LABEL);
		if (!cacheData) {
			next(new HttpException(404, 'Resource not found'));
			return;
		}
		const downloaded = await storageService.download(cacheData.cloudPath);
		logger.info('viewFile downloaded=%o', downloaded, LABEL);
		res.sendFile(downloaded as string);
	} catch (error: any) {
		next(error);
	}
}
