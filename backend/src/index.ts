import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import config from './config';

// Initialize Sequelize
const sequelize = new Sequelize({
	dialect: 'postgres',
	...config.postgres,
	modelPaths: [__dirname + '/models']
});

import timeslotRouter from './routes/timeslot';
import userRouter from './routes/user';

import { json } from 'body-parser';
import { jwtMiddleware } from './utils';

sequelize.sync({ force: config.forceModelSync }).then(() => {
	// Initialize Express
	const app = express();

	app.use(json());
	app.use(jwtMiddleware);

	app.use('/timeslot', timeslotRouter);
	app.use('/user', userRouter);

	app.listen(config.port, () => {
		console.log(`Server listening on *:${config.port}`);
	});
});
