import { Router } from 'express';
import Timeslot from '../models/Timeslot';
import User from '../models/User';
import { errorResponse, requireLoggedIn, successResponse } from '../utils';

const router = Router();

router.get('/timeslots', requireLoggedIn, (req, res) => {
	User.findByPk(req.authorizedUser!, { include: [Timeslot] })
		.then(user => successResponse(res, user!.timeslots.map(t => t.toJSON())))
		.catch(err => errorResponse(res, err));
});

export default router;
