import { Router } from 'express';
import Timeslot from '../models/Timeslot';
import User from '../models/User';
import { errorResponse, requireLoggedIn, successResponse } from '../utils';

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

router.patch('/', requireLoggedIn, (req, res) => {
	User.findByPk(req.authorizedUser!)
		.then(user => {
			const dataSharing = req.body.dataSharing;
			if (typeof dataSharing !== 'undefined') {
				if (typeof dataSharing !== 'boolean') {
					return Promise.reject([new Error('Invalid data sharing value'), 400]);
				}

				user!.dataSharing = dataSharing;
			}

			// TODO: Other attributes

			return user!.save();
		})
		.then(() => successResponse(res))
		.catch(e => {
			if (e instanceof Error) { e = [e]; }
			const [err, code] = e;
			errorResponse(res, err, code);
		});
});

router.get('/timeslots', requireLoggedIn, (req, res) => {
	User.findByPk(req.authorizedUser!, { include: [Timeslot] })
		.then(user => successResponse(res, user!.timeslots.map(t => t.toJSON())))
		.catch(err => errorResponse(res, err));
});

export default router;
