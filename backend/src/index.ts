import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import config from './config';

// Initialize Sequelize
const sequelize = new Sequelize({
	dialect: 'postgres',
	...config.postgres,
	modelPaths: [__dirname + '/models']
});

import battlePlanRouter from './routes/battlePlanTask';
import questionnaireRouter from './routes/questionnaireResponse';
import timerRouter from './routes/timer';
import timeslotRouter from './routes/timeslot';
import userRouter from './routes/user';

import { json } from 'body-parser';
import { jwtMiddleware } from './utils';

(async () => {
	if (typeof config.forceModelSync === 'string') {
		await sequelize.model(config.forceModelSync).sync({ force: true });
	}

	// Initialize Express
	const app = express();

	app.use(json());
	app.use(jwtMiddleware);

	app.use('/battle-plan-tasks', battlePlanRouter);
	app.use('/questionnaire-response', questionnaireRouter);
	app.use('/timers', timerRouter);
	app.use('/timeslot', timeslotRouter);
	app.use('/user', userRouter);

	app.listen(config.port, () => {
		console.log(`Server listening on *:${config.port}`);
	});
})();
