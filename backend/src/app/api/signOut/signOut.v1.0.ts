import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import { signOutOptions } from '@/helpers/cookie';
import * as cacheService from '@/services/cache.service';

export default async function signOut(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const refreshToken = _req.cookies.refreshToken;
		await cacheService.remove(refreshToken);
		res.cookie('accessToken', '', signOutOptions);
		res.cookie('refreshToken', '', signOutOptions);
		res.json({ success: true });
	} catch (error: any) {
		next(error);
	}
}
