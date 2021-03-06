import { Router } from 'express';
import Timeslot from '../models/Timeslot';
import { APIError, errorResponse, requireLoggedIn, requireScope, successResponse } from '../utils';

const router = Router();

router.post('/', requireLoggedIn, (req, res) => {
	const start = new Date(req.body.start);
	if (isNaN(start.getTime())) { errorResponse(res, new APIError('Invalid start time', 400)); return; }

	const classId = req.body.classId;
	if (typeof classId !== 'string') {
		errorResponse(res, new APIError('Invalid Canvas assignment object ID/task title', 400));
		return;
	}

	const timeslot = new Timeslot({ start, user: req.authorizedUser!, classId });
	timeslot.save()
		.then(newTimeslot => successResponse(res, { id: newTimeslot.id }))
		.catch(err => errorResponse(res, err));
});

router.post('/end', requireLoggedIn, (req, res) => {
	const id = parseInt(req.body.id, 10);
	if (isNaN(id)) { errorResponse(res, new APIError('Invalid timeslot ID', 400)); return; }

	const end = new Date(req.body.end);
	if (isNaN(end.getTime())) { errorResponse(res, new APIError('Invalid end time', 400)); return; }

	Timeslot.findById(id)
		.then(timeslot => {
			if (timeslot === null) {
				return Promise.reject(new APIError('Timeslot not found', 404));
			}
			if (timeslot.user !== req.authorizedUser!) {
				return Promise.reject(new APIError('Unauthorized', 401));
			}
			if (timeslot.end !== null) {
				return Promise.reject(new APIError('Timeslot already ended', 409));
			}

			timeslot.end = end;
			return timeslot.save();
		})
		.then(() => successResponse(res))
		.catch(err => errorResponse(res, err));
});

router.get('/all', requireScope('faculty'), (_, res) => {
	Timeslot.findAll()
		.then(timeslots => successResponse(res, { timeslots }))
		.catch(err => errorResponse(res, err));
});

router.get('/:id', requireLoggedIn, (req, res) => {
	const id = parseInt(req.params.id, 10);
	if (isNaN(id)) { errorResponse(res, new APIError('Invalid timeslot ID', 400)); return; }

	Timeslot.findById(id)
		.then(timeslot => {
			if (timeslot === null) {
				errorResponse(res, new APIError('Timeslot not found', 404));
			} else {
				successResponse(res, timeslot.toJSON());
			}
		})
		.catch(err => errorResponse(res, err));
});

export default router;
