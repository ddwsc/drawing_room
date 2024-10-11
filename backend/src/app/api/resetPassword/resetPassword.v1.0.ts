import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import { HttpException, Exception } from '@/utils/errors';
import config from '@/configs/env';
import logger from '@/libs/logger';
import { IUserTokenData } from '@/interfaces/user.interface';
import * as userService from '@/services/user.service';
import * as tokenService from '@/services/token.service';

export default async function resetPassword(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const token: string = _req.params.token;
		logger.info('resetPassword token=%o', token, LABEL);
		const tokenData = tokenService.verify(token);
		logger.info('resetPassword tokenData=%o', tokenData, LABEL);
		const { iam: email } = tokenData as IUserTokenData;
		const selectedUser = await userService.selectOne(email);
		if (!selectedUser) {
			next(new HttpException(404, 'User not found'));
			return;
		}
		logger.info('resetPassword selectedUser=%o', selectedUser.toJSON(), LABEL);
		const redirectUrl = config.domain.front + '/change-password?t=' + token;
		logger.info('resetPassword redirectUrl=%o', redirectUrl, LABEL);
		res.redirect(redirectUrl);
	} catch (error: any) {
		if (error instanceof Exception) {
			if (error.code === 'InvalidToken' || error.code === 'ExpiredToken') {
				next(new HttpException(400, 'Reset request expired'));
				return;
			}
		}
		next(error);
	}
}
