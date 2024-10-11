import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.model";
import { text as randomText } from '@/utils/generators';
import { hashPassword } from '@/helpers/encryption';

class User extends Model {
	public id!: number;
	public email!: string;
	public password!: string;
	public salt!: string;
	public verified!: boolean;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		salt: {
			type: DataTypes.STRING,
			// allowNull: false,
		},
		verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		sequelize,
		modelName: "User",
	}
);

User.addHook('beforeCreate', (record: User, options) => {
	let salt = randomText(4);
	record.salt = salt;
	record.password = hashPassword(record.password, salt);
});

User.addHook('beforeUpdate', (record: User, options) => {
	console.log('beforeUpdate', record.password);
	record.password = hashPassword(record.password, record.salt);
	console.log('beforeUpdate', record.password);
});

export default User;
