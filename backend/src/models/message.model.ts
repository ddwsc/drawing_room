import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.model";

class Message extends Model {
	public id!: number;
	public roomId!: string;
	public userId!: string;
	public type!: string;
	public data!: boolean;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Message.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		data: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "Message",
	}
);

export default Message;
