import express, { Express, Router, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { attachHeaders, errorCatcher, errorHandler } from '@/middlewares/app.middleware';
import config from '@/configs/env';
import apiRouter from './routes';

const router = Router();

router.head('/', (req: Request, res: Response) => {
	res.sendStatus(200);
});

router.use('/api', apiRouter);

// routes available only in development mode
if (config.env === 'development') {
	router.get('/debug', (req: Request, res: Response) => {
		res.send('OK');
	});
}

const app: Express = express();

app.use(helmet());

if (config.domain.allow.length > 0) {
	app.use(
		cors({
			origin: function (origin, callback) {
				if (!origin || config.domain.allow.includes(origin)) callback(null, true);
				else callback(new Error('Not allowed by CORS'));
			},
			credentials: true,
			allowedHeaders: ['Origin', 'Accept', 'Content-Type', 'Authorization', 'X-Requested-With', 'Access-Control-Allow-Origin'],
			exposedHeaders: ['set-cookie'],
		}),
	);
} else {
	app.use(cors());
	app.options('*', cors());
}

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(attachHeaders);
app.use(router);

// send back a 404 error for any unknown api request
app.use(errorCatcher);

// handle error
app.use(errorHandler);

export default app;
