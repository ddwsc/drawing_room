import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import { HttpException, Exception } from '@/utils/errors';
import logger from '@/libs/logger';
import * as tokenService from '@/services/token.service';
import * as cacheService from '@/services/cache.service';
import { IUserCacheData } from '@/interfaces/user.interface';

export function validateAccessToken(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	const accessToken = req.cookies.accessToken;
	logger.info('validateAccessToken accessToken=%o', accessToken, LABEL);
	if (!accessToken) {
		next(new HttpException(403, 'Access required'));
		return;
	}
	try {
		tokenService.verify(accessToken);
		next();
	} catch (error) {
		if (error instanceof Exception) {
			if (error.code === 'InvalidToken' || error.code === 'ExpiredToken') {
				next(new HttpException(403, 'Access expired'));
				return;
			}
		}
		next(error);
	}
}

export async function validateRefreshToken(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	const refreshToken = req.cookies.refreshToken;
	logger.info('validateRefreshToken refreshToken=%o', refreshToken, LABEL);
	if (!refreshToken) {
		next(new HttpException(403, 'Access required'));
		return;
	}
	try {
		tokenService.verify(refreshToken);
		const cacheData: IUserCacheData = await cacheService.select(refreshToken);
		logger.info('validateRefreshToken cacheData=%o', cacheData, LABEL);
		if (!cacheData) throw new Exception('ExpiredToken', 'Expired cache data');
		_req.current_user = {
			id: cacheData.id,
			email: cacheData.email,
		};
		next();
	} catch (error) {
		if (error instanceof Exception) {
			if (error.code === 'InvalidToken' || error.code === 'ExpiredToken') {
				next(new HttpException(403, 'Access expired'));
				return;
			}
		}
		next(error);
	}
}
