import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import { HttpException } from '@/utils/errors';
import logger from '@/libs/logger';
import { IUserAuth, IUserCacheData } from '@/interfaces/user.interface';
import * as userService from '@/services/user.service';
import * as tokenService from '@/services/token.service';
import * as cacheService from '@/services/cache.service';
import { signInOptions, accessOptions } from '@/helpers/cookie';

export default async function signIn(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const requestUser: IUserAuth = {
			email: _req.body.email,
			password: _req.body.password,
		};
		logger.info('signIn requestUser=%o', requestUser, LABEL);
		const selectedUser = await userService.selectOne(requestUser.email);
		if (!selectedUser) {
			next(new HttpException(404, 'User not found'));
			return;
		}
		logger.info('signIn selectedUser=%o', selectedUser.toJSON(), LABEL);
		const matchedPassword = userService.matchPassword(requestUser.password, selectedUser.password, selectedUser.salt);
		logger.info('signIn matchedPassword=%o', matchedPassword, LABEL);
		if (!matchedPassword) {
			next(new HttpException(401, 'Wrong password'));
			return;
		}
		if (!selectedUser.verified) {
			next(new HttpException(401, 'Unverified user'));
			return;
		}
		const refreshToken = tokenService.refreshToken();
		const accessToken = tokenService.accessToken();
		const cacheData: IUserCacheData = {
			id: selectedUser.id,
			email: selectedUser.email,
		};
		await cacheService.insertUserSignIn(refreshToken, cacheData);
		res.cookie('refreshToken', refreshToken, signInOptions);
		res.cookie('accessToken', accessToken, accessOptions);
		logger.info('signIn refreshToken=%o options=%o', refreshToken, signInOptions, LABEL);
		logger.info('signIn accessToken=%o options=%o', accessToken, accessOptions, LABEL);
		res.json({ email: selectedUser.email });
	} catch (error: any) {
		next(error);
	}
}
