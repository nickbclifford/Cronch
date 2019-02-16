import { Router } from 'express';
import NotificationToken from '../models/NotificationToken';
import { APIError, errorResponse, requireLoggedIn, successResponse } from '../utils';

const router = Router();

router.post('/', requireLoggedIn, (req, res) => {
	const expoToken = req.body.expoToken;
	if (typeof expoToken !== 'string') {
		errorResponse(res, new APIError('Invalid Expo notification token', 400));
		return;
	}

	const token = new NotificationToken({ expoToken, user: req.authorizedUser! });

	token.save()
		.then(() => successResponse(res))
		.catch(err => errorResponse(res, err));
});

export default router;
