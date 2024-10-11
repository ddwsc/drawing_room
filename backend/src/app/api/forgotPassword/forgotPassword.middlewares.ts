import Joi from "joi";
import { IRequestSchema } from "@/interfaces/app.interface";
import { validateRequest } from "@/middlewares/app.middleware";

const forgotPasswordSchema: IRequestSchema = {
	body: Joi.object()
		.keys({
			email: Joi.string().email().required(),
		})
		.required(),
};

export const validateForgotPassword = validateRequest(forgotPasswordSchema);
