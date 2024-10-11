import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import { HttpException } from '@/utils/errors';
import config from '@/configs/env';
import logger from '@/libs/logger';
import { IUserAuth } from '@/interfaces/user.interface';
import * as userService from '@/services/user.service';
import * as tokenService from '@/services/token.service';
import { decodeToken } from '@/helpers/token';
import * as mailService from '@/services/mail.service';

const apiVerifyV1_0 = config.domain.back + '/api/v1.0/verify/:token';

export default async function signUp(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const requestUser: IUserAuth = {
			email: _req.body.email,
			password: _req.body.password,
		};
		logger.info('signUp requestUser=%o', requestUser, LABEL);
		const createdUser = await userService.insert(requestUser.email, requestUser.password);
		logger.info('signUp createdUser=%o', createdUser.toJSON(), LABEL);
		const verifyEmailToken = tokenService.verifyEmailToken(createdUser.email);
		const verifyEmailTokenData = decodeToken(verifyEmailToken);
		logger.info('signUp verifyEmailToken=%o data=%o', verifyEmailToken, verifyEmailTokenData, LABEL);
		const verifyUrl = apiVerifyV1_0.replace(':token', verifyEmailToken);
		mailService.sendVerifyEmail(requestUser.email, verifyUrl);
		res.json({ success: true });
	} catch (error: any) {
		if (error && error.name === 'SequelizeUniqueConstraintError') {
			next(new HttpException(400, 'Email existed'));
			return;
		}
		next(error);
	}
}
