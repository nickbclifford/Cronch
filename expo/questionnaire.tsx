import bind from 'bind-decorator';
import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import Question, { QuestionInfo} from './Question';

export interface QuestionnaireState {
	questionIndex: number;
	responseIndex: number | null;
}

export default function createQuestionnaire(submitRoute: string, questions: QuestionInfo[]) {
	// TODO: Save questionnaire responses somewhere
	class Questionnaire extends React.Component<NavigationScreenProps, QuestionnaireState> {

		static navigationOptions = {
			header: null
		};

		constructor(props: NavigationScreenProps) {
			super(props);

			this.state = { questionIndex: 0, responseIndex: null };
		}

		@bind
		private onSelectResponse(index: number) {
			this.setState({ responseIndex: index });
		}

		@bind
		private onNextQuestion() {
			this.setState(prev => ({ questionIndex: prev.questionIndex + 1, responseIndex: null }));
		}

		@bind
		private onSubmit() {
			this.props.navigation.navigate(submitRoute);
			this.setState({ questionIndex: 0, responseIndex: null });
		}

		render() {
			const lastQuestion = this.state.questionIndex === questions.length - 1;
			return (
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.container}>
						<Question
							{...questions[this.state.questionIndex]}
							selectedIndex={this.state.responseIndex}
							onSelectResponse={this.onSelectResponse}
						/>
						<Button
							title={lastQuestion ? 'Submit' : 'Next Question'}
							onPress={lastQuestion ? this.onSubmit : this.onNextQuestion}
							disabled={this.state.responseIndex === null}
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
	},
	button: {
		color: 'green'
	}
});
