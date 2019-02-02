import { fetchWithJwt } from './Utils';

export function submitQuestion(question: string, answer: string) {
        return fetchWithJwt('/questionnaire-response', {
                method: 'POST',
                body: JSON.stringify({ question, answer})
        });
}
