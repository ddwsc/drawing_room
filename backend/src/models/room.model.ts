import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.model';

class Room extends Model {
	public id!: number;
	public name!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Room.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		sequelize,
		modelName: 'Room',
	},
);

export default Room;
