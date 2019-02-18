import { Router } from 'express';
import QuestionnaireResponse from '../models/QuestionnaireResponse';
import { APIError, errorResponse, requireLoggedIn, successResponse } from '../utils';
import questionnaireResponseRouter from './questionnaireResponse';

const router = Router();

router.use('/response', questionnaireResponseRouter);

router.get('/answered/:id', requireLoggedIn, (req, res) => {

	const questionnaireId = parseInt(req.params.id, 10);
	console.log('qusetionaire id ', questionnaireId);
	if (!Number.isFinite(questionnaireId)) { errorResponse(res, new APIError('Invalid questionnaire ID', 400)); return; }

	QuestionnaireResponse.count({
		where: {
			user: req.authorizedUser!,
			questionnaire: questionnaireId
		}
	})
		.then(result => successResponse(res, { answered: result > 0 }))
		.catch(err => errorResponse(res, err));
});

export default router;
