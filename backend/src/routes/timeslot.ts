import { Router } from 'express';
import Timeslot, { TaskType } from '../models/Timeslot';
import { APIError, errorResponse, requireLoggedIn, successResponse } from '../utils';

const router = Router();

router.post('/', requireLoggedIn, (req, res) => {
	const start = new Date(req.body.start);
	if (isNaN(start.getTime())) { errorResponse(res, new APIError('Invalid start time', 400)); return; }

	const taskType: TaskType = req.body.taskType;
	if (typeof taskType !== 'number' && (taskType < TaskType.CANVAS_ASSIGNMENT || taskType > TaskType.CUSTOM)) {
		errorResponse(res, new APIError('Invalid task type', 400));
	}

	const canvasId = req.body.canvasId as string || null;
	if (taskType !== TaskType.CUSTOM && canvasId === null) {
		errorResponse(res, new APIError('Missing required Canvas assignment/class object ID', 400));
		return;
	}
	// Object IDs have to be 24 chars long
	if (taskType !== TaskType.CUSTOM && (typeof canvasId !== 'string' || canvasId.length !== 24)) {
		errorResponse(res, new APIError('Invalid Canvas assignment/class object ID', 400));
		return;
	}

	const customTitle = req.body.customTitle as string || null;
	if (taskType !== TaskType.CANVAS_ASSIGNMENT && customTitle === null) {
		errorResponse(res, new APIError('Missing required custom task title', 400));
		return;
	}
	if (taskType !== TaskType.CANVAS_ASSIGNMENT && typeof customTitle !== 'string') {
		errorResponse(res, new APIError('Invalid custom task title', 400));
		return;
	}

	const timeslot = new Timeslot({ start, taskType, canvasId, customTitle, user: req.authorizedUser! });
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
