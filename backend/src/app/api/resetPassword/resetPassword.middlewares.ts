import Joi from 'joi';
import { IRequestSchema } from '@/interfaces/app.interface';
import { validateRequest } from '@/middlewares/app.middleware';

const resetPasswordSchema: IRequestSchema = {
	params: Joi.object()
		.keys({
			token: Joi.string().required(),
		})
		.required(),
};

export const validateResetPassword = validateRequest(resetPasswordSchema);
