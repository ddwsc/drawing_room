export interface IUserAuth {
	email: string;
	password: string;
}

export interface IUserTokenData {
	iam: string;
	iat: number;
	exp: number;
}

export interface IUserCacheData {
	id: number;
	email: string;
	// roomId?: number;
}
