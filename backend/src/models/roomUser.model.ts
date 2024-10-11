import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.model";

class RoomUser extends Model {
	public roomId!: number;
	public userId!: number;
	public active!: boolean;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

RoomUser.init(
	{
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "RoomUser",
	}
);

export default RoomUser;
