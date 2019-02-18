import bind from 'bind-decorator';
import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { submitResponse } from '../common/QuestionnaireResponse';
import { QuestionnaireInfo } from '../common/Questionnaires';
import { PRIMARY } from '../common/StyleGuide';
import Question from './Question';

export interface QuestionnaireState {
	loading: boolean;
	questionIndex: number;
	responseId: number | null;
}

export default function createQuestionnaire(questionnaireInfo: QuestionnaireInfo, redirectAfter?: string, redirectAfterParams?: { [key: string]: any }) {
	class Questionnaire extends React.Component<NavigationScreenProps, QuestionnaireState> {

		static navigationOptions = {
			header: null
		};

		constructor(props: NavigationScreenProps) {
			super(props);
			this.state = { loading: false, questionIndex: 0, responseId: null };
		}

		@bind
		private onSelectResponse(id: number) {
			this.setState({ responseId: id });
		}

		@bind
		private async onNextQuestion() {
			await this.saveSelectedResponse();
			this.setState(prev => ({ questionIndex: prev.questionIndex + 1, responseId: null }));
		}

		@bind
		private async onSubmit() {
			await this.saveSelectedResponse();
			this.setState({ questionIndex: 0, responseId: null });

			let submitRoute: string | null = null;
			let submitParams: any | undefined;

			const redirectParam = this.props.navigation.getParam('redirectAfter');
			const redirectParamsParam = this.props.navigation.getParam('redirectAfterParams');

			if (typeof redirectParam === 'string') {
				submitRoute = redirectParam;
				submitParams = redirectParamsParam;

			} else if (typeof redirectAfter === 'string') {
				submitRoute = redirectAfter;

				if (redirectAfterParams) {
					submitParams = redirectAfterParams;
				}
			}

			if (submitRoute) {
				this.props.navigation.navigate(submitRoute, submitParams);
			}
		}

		private async saveSelectedResponse() {
			if (this.state.responseId === null) { return; }
			this.setState({ loading: true });
			const question = questionnaireInfo.questions[this.state.questionIndex];
			await submitResponse(questionnaireInfo.id, question.id, this.state.responseId);
			this.setState({ loading: false });
		}

		render() {
			const lastQuestion = this.state.questionIndex === questionnaireInfo.questions.length - 1;
			return (
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.container}>
						<Question
							{...questionnaireInfo.questions[this.state.questionIndex]}
							selectedId={this.state.responseId}
							onSelectResponse={this.onSelectResponse}
						/>
						<Button
							color={PRIMARY[700]}
							title={lastQuestion ? 'Submit' : 'Next'}
							onPress={lastQuestion ? this.onSubmit : this.onNextQuestion}
							disabled={this.state.responseId === null}
						/>
					</View>
				</SafeAreaView>
			);
		}

	}

	return Questionnaire;
}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%'
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
