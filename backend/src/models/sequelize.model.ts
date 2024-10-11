import { Dialect, Sequelize } from 'sequelize';
// import mysql2 from "mysql2";
import config from '@/configs/env';

const sequelizeConnection = new Sequelize(config.db.name, config.db.username, config.db.password, {
	host: config.db.host,
	dialect: config.db.dialect as Dialect,
	// dialectModule: mysql2,
	logging: config.db.logging,
	port: config.db.port,
	define: {
		charset: 'utf8',
		collate: 'utf8_general_ci',
	},
	pool: {
		max: config.db.poolMax,
		min: config.db.poolMin,
		acquire: config.db.poolAcquire,
		idle: config.db.poolIdle,
	},
});

export default sequelizeConnection;
