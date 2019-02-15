import { Router } from 'express';
import BattlePlanTask from '../models/BattlePlanTask';
import { APIError, errorResponse, requireLoggedIn, successResponse } from '../utils';

const router = Router();

router.post('/', requireLoggedIn, (req, res) => {
	const taskIds: string[] = req.body;
	if (!(taskIds instanceof Array && taskIds.every(t => typeof t === 'string'))) {
		errorResponse(res, new APIError('Invalid list of task IDs', 400));
		return;
	}

	const tasks = taskIds.map((taskId, index) => new BattlePlanTask({
		user: req.authorizedUser!,
		planOrder: index,
		taskId
	}));

	// Get rid of all of a user's battle plan tasks before inserting them
	BattlePlanTask.destroy({ where: { user: req.authorizedUser! } })
		.then(() => BattlePlanTask.bulkCreate(tasks))
		.then(() => successResponse(res))
		.catch(err => errorResponse(res, err));
});

export default router;
