import { Router } from 'express';
import Timer from '../models/Timer';
import { APIError, errorResponse, requireLoggedIn, successResponse } from '../utils';

const router = Router();

router.post('/', requireLoggedIn, (req, res) => {
	const timers = req.body.timers;
	// too lazy to do full input validation rn
	if (!(timers instanceof Array && timers.every(t => typeof t === 'object'))) {
		errorResponse(res, new APIError('Invalid list of timer data', 400));
		return;
	}

	const timerObjs = timers.map(t => ({ ...t, user: req.authorizedUser! }));
	return Timer.destroy({
		where: {
			user: req.authorizedUser!
		}
	}).then(() => Timer.bulkCreate(timerObjs))
		.then(() => successResponse(res))
		.catch(err => errorResponse(res, err));
});

export default router;
