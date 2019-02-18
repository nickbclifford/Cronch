import { Router } from 'express';
import QuestionnaireResponse from '../models/QuestionnaireResponse';
import { APIError, errorResponse, requireLoggedIn, successResponse } from '../utils';

const router = Router();

router.post('/', requireLoggedIn, (req, res) => {
	const questionnaire = req.body.questionnaire;
	if (typeof questionnaire !== 'number') { errorResponse(res, new APIError('Invalid question', 400)); return; }

	const question = req.body.question;
	if (typeof question !== 'number') { errorResponse(res, new APIError('Invalid question', 400)); return; }

	const answer = req.body.answer;
	if (typeof answer !== 'number') { errorResponse(res, new APIError('Invalid answer', 400)); return; }

	const response = new QuestionnaireResponse({ questionnaire, question, answer, user: req.authorizedUser! });
	response.save()
		.then(() => successResponse(res))
		.catch(err => errorResponse(res, err));
});

router.get('/:id', requireLoggedIn, (req, res) => {
	const id = parseInt(req.params.id, 10);
	if (isNaN(id)) { errorResponse(res, new APIError('Invalid questionnaire response ID', 400)); return; }

	QuestionnaireResponse.findById(id)
		.then(response => {
			if (response === null) {
				errorResponse(res, new APIError('Questionnaire response not found', 404));
			} else {
				successResponse(res, response.toJSON());
			}
		})
		.catch(err => errorResponse(res, err));
});

export default router;
