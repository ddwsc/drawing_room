import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export interface IRequest extends Request {
	request_id: string;
	version_tag: string;
	current_user: {
		id: number;
		email: string;
	};
}

export interface IResponse extends Response {
	// redirect(arg0: any): unknown;
}

export interface INext extends NextFunction {}

export interface IRequestSchema {
	params?: Joi.ObjectSchema;
	query?: Joi.ObjectSchema;
	body?: Joi.ObjectSchema;
}
