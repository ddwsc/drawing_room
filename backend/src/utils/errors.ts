export class HttpException extends Error {
	status?: number;
	message: string;
	error: string | null;

	constructor(status: number, message: string, error?: string) {
		super(message);
		this.status = status;
		this.message = message;
		this.error = error || null;
	}
}

export class Exception extends Error {
	status?: number;
	message: string;
	code: string;
	cause: any;

	constructor(code: string, message: string, cause?: any) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.code = code;
		if (cause) this.cause = cause;
	}
}
