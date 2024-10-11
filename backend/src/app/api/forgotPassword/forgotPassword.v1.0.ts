import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import { HttpException } from '@/utils/errors';
import config from '@/configs/env';
import logger from '@/libs/logger';
import * as userService from '@/services/user.service';
import * as tokenService from '@/services/token.service';
import { decodeToken } from '@/helpers/token';
import * as mailService from '@/services/mail.service';

const apiResetV1_0 = config.domain.back + '/api/v1.0/reset-password/:token';

export default async function forgotPassword(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const email: string = _req.body.email;
		logger.info('forgotPassword email=%o', email, LABEL);
		const selectedUser = await userService.selectOne(email);
		if (!selectedUser) {
			next(new HttpException(404, 'User not found'));
			return;
		}
		logger.info('forgotPassword selectedUser=%o', selectedUser.toJSON(), LABEL);
		const resetPasswordToken = tokenService.resetPasswordToken(email);
		const resetPasswordTokenData = decodeToken(resetPasswordToken);
		logger.info('forgotPassword resetPasswordToken=%o data=%o', resetPasswordToken, resetPasswordTokenData, LABEL);
		const resetUrl = apiResetV1_0.replace(':token', resetPasswordToken);
		mailService.sendResetPassword(email, resetUrl);
		res.json({ success: true });
	} catch (error: any) {
		if (error && error.name === 'SequelizeUniqueConstraintError') {
			next(new HttpException(400, 'Email existed'));
			return;
		}
		next(error);
	}
}
