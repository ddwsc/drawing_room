import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import * as generator from '@/utils/generators';
import { IRequest, IRequestSchema } from '@/interfaces/app.interface';
import { HttpException } from '@/utils/errors';
import logger from '@/libs/logger';

export function attachHeaders(req: Request, res: Response, next: NextFunction): void {
	const _req = req as IRequest;
	const requestId = generator.uuid();
	_req.request_id = requestId;
	res.setHeader('X-Request-ID', requestId);
	next();
}

export function errorCatcher(req: Request, res: Response, next: NextFunction): void {
	next(new HttpException(404, 'Resource not found'));
}

export function errorHandler(err: HttpException, req: Request, res: Response, next: NextFunction): void {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	logger.error('errorHandler %o', err.status ? err.message : err, LABEL);
	const status = err.status || 500;
	const message = status === 500 ? 'Internal server error' : err.message || 'Internal server error';
	res.status(status).json({ message });
}

export function validateRequest(schema: IRequestSchema) {
	return function (req: Request, res: Response, next: NextFunction) {
		const _req = req as IRequest;
		const LABEL = { label: _req.request_id };
		let object: any = {};
		const { params, query, body } = _req;
		if (Object.keys(params).length) object['params'] = { ...params };
		if (Object.keys(query).length) object['query'] = { ...query };
		if (Object.keys(body).length) object['body'] = { ...body };
		const { value, error } = Joi.compile(schema).validate(object);
		if (error) {
			logger.error('validateRequest %s', error.message, LABEL);
			res.status(400).json({
				message: (error && error.message) || 'Invalid request inputs',
			});
			return;
		}
		Object.assign(req, value);
		next();
	};
}
