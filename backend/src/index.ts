import 'module-alias/register';
import '@/configs/console';
import { Server, createServer } from 'http';
import config from '@/configs/env';
import logger from '@/libs/logger';
import { sequelize } from '@/models';
import { cacheClient } from './services/cache.service';
import apiApp from '@/app/api/server';
import * as socketApp from '@/app/socket/server'

let server: Server;

(async () => {
	logger.info('Environment: %s', config.env);
	try {
		server = createServer(apiApp);
		socketApp.init(server);
		await sequelize.authenticate();
		await sequelize.sync();
		await cacheClient.connect();
		server.listen(config.port, () => {
			logger.info('Listening to port: %o', config.port);
		});
	} catch (error) {
		console.error('Unable to start server:', error);
		setTimeout(() => {
			exitHandler();
		}, 5000);
	}
})();

function exitHandler() {
	if (server) {
		server.close(() => {
			console.info('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
}

function unexpectedErrorHandler(error: unknown) {
	console.error(error);
	exitHandler();
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
	console.info('SIGTERM received');
	if (server) {
		server.close();
	}
});
