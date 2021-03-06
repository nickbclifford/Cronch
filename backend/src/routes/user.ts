import { Router } from 'express';
import BattlePlanTask from '../models/BattlePlanTask';
import Timer from '../models/Timer';
import Timeslot from '../models/Timeslot';
import User, { DataSharing } from '../models/User';
import { APIError, errorResponse, requireLoggedIn, successResponse } from '../utils';

const router = Router();

// Basically just registers a user with us
// Called after first login
router.post('/', requireLoggedIn, (req, res) => {
	const user = new User({
		username: req.authorizedUser!
	});
	user.save()
		.then(() => successResponse(res))
		.catch(err => errorResponse(res, err));
});

router.get('/', requireLoggedIn, (req, res) => {
	User.findByPk(req.authorizedUser!)
		.then(user => {
			return successResponse(res, { user: user ? user.toJSON() : null });
		})
		.catch(err => errorResponse(res, err));
});

router.patch('/', requireLoggedIn, (req, res) => {
	User.findByPk(req.authorizedUser!)
		.then(user => {
			const dataSharing = req.body.dataSharing;
			const alarmSelection = req.body.alarmSelection;
			const timerSelection = req.body.timerSelection;

			if (typeof dataSharing !== 'undefined') {
				if (typeof dataSharing !== 'number' && (dataSharing < DataSharing.NO_SEND || dataSharing > DataSharing.FULL_SEND)) {
					return Promise.reject(new APIError('Invalid data sharing value', 400));
				}

				user!.dataSharing = dataSharing;
			}

			if (typeof alarmSelection !== 'undefined') {
				if (typeof alarmSelection !== 'number') {
					return Promise.reject(new APIError('Invalid alarm selection value', 400));
				}

				user!.alarmSelection = alarmSelection;
			}

			if (typeof timerSelection !== 'undefined') {
				if (typeof timerSelection !== 'number') {
					return Promise.reject(new APIError('Invalid timer selection value', 400));
				}

				user!.timerSelection = timerSelection;
			}

			// TODO: Other attributes

			return user!.save();
		})
		.then(() => successResponse(res))
		.catch(err => errorResponse(res, err));
});

router.get('/timeslots', requireLoggedIn, (req, res) => {
	User.findByPk(req.authorizedUser!, { include: [Timeslot] })
		.then(user => successResponse(res, user!.timeslots.map(t => t.toJSON())))
		.catch(err => errorResponse(res, err));
});

router.get('/timers', requireLoggedIn, (req, res) => {
	User.findByPk(req.authorizedUser!, { include: [Timer] })
		.then(user => successResponse(res, user!.timers.map(t => t.toJSON())))
		.catch(err => errorResponse(res, err));
});

router.get('/battle-plan-tasks', requireLoggedIn, (req, res) => {
	User.findByPk(req.authorizedUser!, { include: [BattlePlanTask] })
		.then(user => {
			if (user) {
				successResponse(res, user.battlePlanTasks.map(t => t.toJSON()));
			} else {
				successResponse(res, []);
			}
		})
		.catch(err => errorResponse(res, err));
});

export default router;
