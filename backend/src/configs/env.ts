import Joi from 'joi';
import path from 'path';
import dotenv from 'dotenv';
import { IEnvConfig } from '@/interfaces/env.interface';

const envFileName = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFileName) });

const schema = Joi.object()
	.keys({
		ENV: Joi.string().default('development').valid('development', 'test', 'staging', 'production'),
		PORT: Joi.number().default(5050),
		DOMAIN_FRONT: Joi.string().default('http://localhost:5173'),
		DOMAIN_BACK: Joi.string().default('http://localhost:5050'),
		ALLOW_DOMAINS: Joi.string().default(''),

		LOG_DIR: Joi.string().default('logs'),
		LOG_DAYS: Joi.number().default(14),

		API_ROOM_MAX_USERS: Joi.number().default(30),

		SOCKET_EVENT_ROOM_MEMBERS: Joi.string().default('RoomMembers'),
		SOCKET_EVENT_ROOM_MESSAGES: Joi.string().default('RoomMessages'),

		UPLOAD_DIR: Joi.string().default('uploads'),
		UPLOAD_MAX_SIZE: Joi.number().default(5),

		TOKEN_SECRET: Joi.string().required(),
		TOKEN_ACCESS_MINUTE: Joi.number().default(6),
		TOKEN_REFRESH_HOUR: Joi.number().default(24),
		TOKEN_VERIFY_EMAIL_HOUR: Joi.number().default(24),
		TOKEN_RESET_PASSWORD_HOUR: Joi.number().default(2),
		TOKEN_FILE_HOUR: Joi.number().default(10),

		DB_USER: Joi.string().default('root'),
		DB_PASS: Joi.string().default(''),
		DB_NAME: Joi.string().required(),
		DB_HOST: Joi.string().default('localhost'),
		DB_PORT: Joi.number().default(3306),
		DB_DIALECT: Joi.string().default('mysql'),
		DB_DEBUG: Joi.boolean().default(false),
		DB_POOL_MAX: Joi.number().default(5),
		DB_POOL_MIN: Joi.number().default(0),
		DB_POOL_ACQUIRE: Joi.number().default(30000),
		DB_POOL_IDLE: Joi.number().default(10000),

		REDIS_HOST: Joi.string().default('localhost'),
		REDIS_PORT: Joi.number().default(6379),

		NODEMAILER_GMAIL_USER: Joi.string().required(),
		NODEMAILER_GMAIL_PASS: Joi.string().required(),

		GCP_KEY_FILE: Joi.string().default(''),
		GCP_BUCKET_NAME: Joi.string().default(''),
	})
	.unknown();

let { value, error } = schema.validate(process.env);
if (error) {
	throw new Error(`EnvironmentVariablesError: ${error}`);
}

const config: IEnvConfig = {
	env: value.ENV,
	port: value.PORT,
	domain: {
		front: value.DOMAIN_FRONT,
		back: value.DOMAIN_BACK,
		allow: value.ALLOW_DOMAINS.split(',').filter((el: string) => el !== ''),
	},
	log: {
		dir: value.LOG_DIR,
		maxFiles: `${value.LOG_DAYS}d`,
	},
	api: {
		room: {
			maxUsers: value.API_ROOM_MAX_USERS,
		}
	},
	socket: {
		event: {
			roomMembers: value.SOCKET_EVENT_ROOM_MEMBERS,
			roomMessages: value.SOCKET_EVENT_ROOM_MESSAGES,
		}
	},
	upload: {
		dir: value.UPLOAD_DIR,
		maxSize: value.UPLOAD_MAX_SIZE,
	},
	token: {
		secret: value.TOKEN_SECRET,
		accessExpire: `${value.TOKEN_ACCESS_MINUTE}m`,
		refreshExpire: `${value.TOKEN_REFRESH_HOUR}h`,
		verifyEmailExpire: `${value.TOKEN_VERIFY_EMAIL_HOUR}h`,
		resetPasswordExpire: `${value.TOKEN_RESET_PASSWORD_HOUR}h`,
		fileExpire: `${value.TOKEN_FILE_HOUR}h`,
	},
	cache: {
		userAccessExpire: value.TOKEN_ACCESS_MINUTE * 60 * 1000,
		userSignInExpire: value.TOKEN_REFRESH_HOUR * 60 * 60 * 1000,
		fileExpire: value.TOKEN_FILE_HOUR * 60 * 60 * 1000,
	},
	db: {
		username: value.DB_USER,
		password: value.DB_PASS,
		name: value.DB_NAME,
		host: value.DB_HOST,
		port: value.DB_PORT,
		dialect: value.DB_DIALECT,
		logging: value.DB_DEBUG,
		poolMax: value.DB_POOL_MAX,
		poolMin: value.DB_POOL_MIN,
		poolAcquire: value.DB_POOL_ACQUIRE,
		poolIdle: value.DB_POOL_IDLE,
	},
	redis: {
		host: value.REDIS_HOST,
		port: value.REDIS_PORT,
	},
	nodemailer: {
		user: value.NODEMAILER_GMAIL_USER,
		pass: value.NODEMAILER_GMAIL_PASS,
	},
	gcp: {
		keyFile: value.GCP_KEY_FILE,
		bucketName: value.GCP_BUCKET_NAME,
	},
};

export default config;
