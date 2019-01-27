import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import config from './config';

// Initialize Sequelize
const sequelize = new Sequelize({
	dialect: 'postgres',
	...config.postgres,
	modelPaths: [__dirname + '/models']
});

sequelize.sync({ force: config.forceModelSync }).then(() => {
	// Initialize Express
	const app = express();

	app.listen(config.port, () => {
		console.log(`Server listening on *:${config.port}`);
	});
});
