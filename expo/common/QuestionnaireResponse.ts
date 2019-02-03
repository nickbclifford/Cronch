import { fetchWithJwt } from './Utils';

export interface QuestionnaireResponse {
	id: number;
	question: string;
	answer: string;
	user: string;
}

export function submitResponse(question: string, answer: string) {
	return fetchWithJwt('/questionnaire-response', {
		method: 'POST',
		body: JSON.stringify({ question, answer })
	});
}

export function getResponse(id: number) {
	return fetchWithJwt<QuestionnaireResponse>(`/questionnaire-response/${id}`, {
		method: 'GET'
	});
}
