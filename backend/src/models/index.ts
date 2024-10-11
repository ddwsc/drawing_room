import _sequelize from './sequelize.model';
import User from './user.model';
import Room from './room.model';
import RoomUser from './roomUser.model';
import Action from './action.model';
import Message from './message.model';

User.belongsToMany(Room, {
	through: RoomUser,
	foreignKey: 'userId',
});
Room.belongsToMany(User, {
	through: RoomUser,
	foreignKey: 'roomId',
});
User.hasMany(RoomUser, { foreignKey: 'userId' });
RoomUser.belongsTo(User, { foreignKey: 'userId' });
Room.hasMany(RoomUser, { foreignKey: 'roomId' });
RoomUser.belongsTo(Room, { foreignKey: 'roomId' });

User.hasMany(Action, {
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
});
Action.belongsTo(User, {
	foreignKey: 'userId',
});
Room.hasMany(Action, {
	foreignKey: {
		name: 'roomId',
		allowNull: false,
	},
});
Action.belongsTo(Room, {
	foreignKey: 'roomId',
});

User.hasMany(Message, {
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
});
Message.belongsTo(User, {
	foreignKey: 'userId',
});
Room.hasMany(Message, {
	foreignKey: {
		name: 'roomId',
		allowNull: false,
	},
});
Message.belongsTo(Room, {
	foreignKey: 'roomId',
});

export const sequelize = _sequelize;
export const UserModel = User;
export const RoomModel = Room;
export const RoomUserModel = RoomUser;
export const ActionModel = Action;
export const MessageModel = Message;
