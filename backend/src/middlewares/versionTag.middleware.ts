import { Request, Response, NextFunction } from "express";
import {
	IRequest,
} from "@/interfaces/app.interface";
import { HttpException } from "@/utils/errors";

const apiVersionRegex = /^(v\d+\.\d+)$/;

export function validateVersionTag(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const _req = req as IRequest;
	const requestVersion = _req.params && _req.params.version;
	if (!apiVersionRegex.test(requestVersion)) {
		next(new HttpException(404, "Resource not found"));
		return;
	}
	_req.version_tag = requestVersion;
	res.setHeader("X-API-Version", requestVersion);
	next();
}

export function forwardVersionTag(version: string) {
	return function (req: Request, res: Response, next: NextFunction) {
		const _req = req as IRequest;
		const requestVersion = _req.version_tag;
		const requestVersionNumber = parseFloat(requestVersion.substring(1));
		const versionNumber = parseFloat(version);
		if (requestVersionNumber === versionNumber) {
			next();
			return;
		}
		next("route"); // skip to the next route
	};
}
