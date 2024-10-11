export interface IListRoomItem {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	RoomUsers: { userId: number }[];
}

export interface IListRoomResponse {
	count: number;
	rooms: {
		name: string;
		joined: number;
		max: number;
	}[],
	currentPage: number;
	totalPage: number;
}

export interface IJoinRoomItem {
	room: {
		name: string;
		members: number;
	}
}
