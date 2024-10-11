import { Op } from 'sequelize';
import { RoomModel, RoomUserModel } from '@/models';
import { uuid } from '@/utils/generators';

export function insert() {
	return RoomModel.create({ name: uuid() });
}

export function selectOne(name: string) {
	return RoomModel.findOne({ where: { name } });
}

export function joinRoom(userId: number, roomId: number) {
	return RoomUserModel.findOne({
		where: {
			userId,
			roomId,
		},
	}).then(function (row) {
		if (row) return row.update({ active: true }, { where: { userId, roomId } });
		return RoomUserModel.create({ userId, roomId });
	});
}

export function leaveRoom(userId: number, roomId: number) {
	return RoomUserModel.update({ active: false }, { where: { userId, roomId } });
}

export function selectInAllRoom(userId: number) {
	return RoomUserModel.findOne({
		where: { userId, active: true },
		attributes: ['roomId', 'userId', 'active'],
	});
}

export function selectActiveRoomMembers(roomId: number) {
	return RoomUserModel.findAll({
		where: { roomId, active: true },
		attributes: ['roomId', 'userId', 'active'],
	});
}

export function list(startsWith = '', pageNo = 1, pageSize = 10, orderBy = 'updatedAt', orderDesc = true) {
	let where = !startsWith
		? {}
		: {
				name: {
					[Op.like]: `${startsWith}%`,
				},
		  };
	return RoomModel.findAll({
		where: { ...where },
		include: [
			{
				model: RoomUserModel,
				attributes: ['userId'],
				where: {
					active: true,
				},
				required: false,
			},
		],
		order: [[orderBy, orderDesc ? 'DESC' : 'ASC ']],
		offset: (pageNo - 1) * pageSize,
		limit: pageSize,
		// logging: console.log,
	});
}

export function count(startsWith = '') {
	let where = !startsWith
		? {}
		: {
				name: {
					[Op.like]: `${startsWith}%`,
				},
		  };
	return RoomModel.count({
		where: { ...where },
		// logging: console.log,
	});
}
