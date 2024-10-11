import { Server } from 'socket.io';
import { createServer } from 'http';
import config from '@/configs/env';
import { onConnection, validateSocketToken } from './middlewares';

let io: Server;

export function init(httpServer: ReturnType<typeof createServer>) {
	io = new Server(httpServer, {
		cors: {
			origin: config.domain.allow.length > 0 ? config.domain.allow : '*',
			credentials: true,
		},
	});
	io.on('connection', onConnection);
	io.use(validateSocketToken);
	return io;
};

export function getInstance() {
	if (!io) {
		throw new Error('Socket.io not initialized!');
	}
	return io;
};
