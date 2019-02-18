import { fetchWithJwt } from './Utils';

export interface AnsweredResponse {
	answered: boolean;
}

export interface QuestionnaireResponse {
	id: number;
	question: string;
	answer: string;
	user: string;
	answeredAt: Date;
}

export function getIfAnsweredQuestionnaire(questionnaireId: number) {
	return fetchWithJwt<AnsweredResponse>(`/questionnaire/answered/${questionnaireId}`, {
		method: 'GET'
	});
}

export function submitResponse(questionnaire: number, question: number, answer: number) {
	return fetchWithJwt('/questionnaire/response', {
		method: 'POST',
		body: JSON.stringify({ questionnaire, question, answer })
	});
}

export function getResponse(id: number) {
	return fetchWithJwt<QuestionnaireResponse>(`/questionnaire/response/${id}`, {
		method: 'GET'
	}).then(q => {
		q.answeredAt = new Date(q.answeredAt);
		return q;
	});
}
