import { Router } from 'express';
import Timeslot from '../models/Timeslot';
import { errorResponse, requireLoggedIn, successResponse } from '../utils';

const router = Router();

router.post('/', requireLoggedIn, (req, res) => {
	const start = new Date(req.body.start);
	if (isNaN(start.getTime())) { errorResponse(res, new Error('Invalid start time'), 400); return; }

	const canvasId = req.body.canvasId;
	// Object IDs have to be 24 chars long
	if (typeof canvasId !== 'string' || canvasId.length !== 24) {
		errorResponse(res, new Error('Invalid Canvas event object ID'), 400);
		return;
	}

	const timeslot = new Timeslot({ start, canvasId, user: req.authorizedUser! });
	timeslot.save()
		.then(() => successResponse(res))
		.catch(err => errorResponse(res, err));
});

router.post('/end', requireLoggedIn, (req, res) => {
	const id = parseInt(req.body.id, 10);
	if (isNaN(id)) { errorResponse(res, new Error('Invalid timeslot ID'), 400); return; }

	const end = new Date(req.body.end);
	if (isNaN(end.getTime())) { errorResponse(res, new Error('Invalid end time'), 400); return; }

	Timeslot.findById(id)
		.then(timeslot => {
			if (timeslot === null) {
				errorResponse(res, new Error('Timeslot not found'), 404);
				return;
			}
			if (timeslot.user !== req.authorizedUser!) {
				errorResponse(res, new Error('Unauthorized'), 401);
				return;
			}
			if (timeslot.end !== null) {
				errorResponse(res, new Error('Timeslot already ended'), 409);
				return;
			}

			timeslot.end = end;
			return timeslot.save().then(() => successResponse(res));
		})
		.catch(err => errorResponse(res, err));
});

router.get('/:id', requireLoggedIn, (req, res) => {
	const id = parseInt(req.params.id, 10);
	if (isNaN(id)) { errorResponse(res, new Error('Invalid timeslot ID'), 400); return; }

	Timeslot.findById(id)
		.then(timeslot => {
			if (timeslot === null) {
				errorResponse(res, new Error('Timeslot not found'), 404);
			} else {
				successResponse(res, timeslot.toJSON());
			}
		})
		.catch(err => errorResponse(res, err));
});

export default router;
