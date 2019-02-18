export interface ResponseInfo {
	id: number;
	answer: string;
}

export interface QuestionInfo {
	id: number;
	question: string;
	responses: ResponseInfo[];
}

export interface QuestionnaireInfo {
	id: number;
	questions: QuestionInfo[];
}

const questionnaires: { [key: string]: QuestionnaireInfo } = {

	/**
	 * Initial Onboarding Survey
	 */

	initial: {
		id: 0,
		questions: [
			{
				id: 0,
				question: 'How well do you think you manage your time?',
				responses: [
					{
						id: 5,
						answer: 'Great'
					},
					{
						id: 4,
						answer: 'Good'
					},
					// Absence of answer id: 3 because there is not 'neutral' response
					{
						id: 2,
						answer: 'Bad'
					},
					{
						id: 1,
						answer: 'Terrible'
					}
				]
			},
			{
				id: 1,
				question: 'How often do you get distracted while doing homework?',
				responses: [
					{
						id: 5,
						answer: 'Frequently'
					},
					{
						id: 4,
						answer: 'A fair amount'
					},
					{
						id: 2,
						answer: 'Not often'
					},
					{
						id: 1,
						answer: 'Never'
					}
				]
			},
			{
				id: 2,
				question: 'How stressful have you recently felt with regards to schoolwork?',
				responses: [
					{
						id: 5,
						answer: 'Very much'
					},
					{
						id: 4,
						answer: 'A fair amount'
					},
					{
						id: 2,
						answer: 'Not much'
					},
					{
						id: 1,
						answer: 'Not at all'
					}
				]
			}
		]
	}
};

export default questionnaires;
