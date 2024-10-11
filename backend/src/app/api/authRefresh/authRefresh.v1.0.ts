import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import logger from '@/libs/logger';
import * as tokenService from '@/services/token.service';
import { accessOptions } from '@/helpers/cookie';

export default async function authRefresh(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const accessToken = tokenService.accessToken();
		res.cookie('accessToken', accessToken, accessOptions);
		logger.info('authRefresh accessToken=%o options=%o', accessToken, accessOptions, LABEL);
		res.json({ success: true });
	} catch (error: any) {
		next(error);
	}
}
