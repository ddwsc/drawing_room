import Joi from 'joi';
import { IRequestSchema } from '@/interfaces/app.interface';
import { validateRequest } from '@/middlewares/app.middleware';

const changePasswordSchema: IRequestSchema = {
	params: Joi.object()
		.keys({
			token: Joi.string().required(),
		})
		.required(),
	body: Joi.object()
		.keys({
			password: Joi.string().min(6).max(32).required(),
		})
		.required(),
};

export const validateChangePassword = validateRequest(changePasswordSchema);
