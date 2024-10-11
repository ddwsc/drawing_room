import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';
import { HttpException, Exception } from '@/utils/errors';
import config from '@/configs/env';
import logger from '@/libs/logger';
import * as roomService from '@/services/room.service';
import { IListRoomItem, IListRoomResponse } from '@/interfaces/room.interface';
import { countTotalPages } from './listRoom.helpers';

export default async function listRoom(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const startWith = _req.query.name as string;
		const currentPage = Number(_req.query.page);
		const pageSize = Number(_req.query.size);
		logger.info('listRoom startWith=%o currentPage=%o pageSize=%o', startWith, currentPage, pageSize, LABEL);
		const count = await roomService.count(startWith);
		logger.info('listRoom count=%o', count, LABEL);
		if (count < 1) {
			const data: IListRoomResponse = {
				count,
				rooms: [],
				currentPage: 0,
				totalPage: 0
			}
			logger.info('listRoom res.data=%o', data, LABEL);
			res.json(data);
			return;
		}
		const rooms = await roomService.list(startWith, currentPage, pageSize);
		logger.info('listRoom rooms.length=%o', rooms.length, LABEL);
		const data: IListRoomResponse = {
			count,
			rooms: rooms.map(room => {
				const { name, RoomUsers } = room.toJSON() as IListRoomItem;
				return {
					name,
					joined: RoomUsers.length,
					max: config.api.room.maxUsers,
				}
			}),
			currentPage: currentPage,
			totalPage: countTotalPages(count, pageSize)
		}
		logger.info('listRoom res.data=%o', data, LABEL);
		res.json(data);
		return;
	} catch (error: any) {
		next(error);
	}
}
