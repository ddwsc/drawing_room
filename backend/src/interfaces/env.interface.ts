export interface IEnvConfig {
	env: string;
	port: number;
	domain: {
		front: string;
		back: string;
		allow: string[];
	};
	log: {
		dir: string;
		maxFiles: string;
	};
	api: {
		room: {
			maxUsers: number;
		}
	};
	socket: {
		event: {
			roomMembers: string;
			roomMessages: string;
		}
	};
	token: {
		secret: string;
		accessExpire: string;
		refreshExpire: string;
		verifyEmailExpire: string;
		resetPasswordExpire: string;
	};
	cache: {
		userAccessExpire: number;
		userSignInExpire: number;
	};
	db: {
		username: string;
		password: string;
		name: string;
		host: string;
		port: number;
		dialect: string;
		logging: boolean;
		poolMax: number;
		poolMin: number;
		poolAcquire: number;
		poolIdle: number;
	};
	redis: {
		host: string;
		port: number;
	};
	nodemailer: {
		user: string;
		pass: string;
	};
}
