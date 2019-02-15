import { Router } from 'express';
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
		.then(user => successResponse(res, user!.toJSON()))
		.catch(err => errorResponse(res, err));
});

router.patch('/', requireLoggedIn, (req, res) => {
	User.findByPk(req.authorizedUser!)
		.then(user => {
			const dataSharing = req.body.dataSharing;
			const alarmSelection = req.body.alarmSelection;
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

				user!.dataSharing = dataSharing;
				user!.alarmSelection = alarmSelection;
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

export default router;
