import bind from 'bind-decorator';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';

import { QuestionInfo } from '../common/Questionnaires';
import { typography } from '../common/StyleGuide';

export interface QuestionProps extends QuestionInfo {
	selectedId: number | null;
	onSelectResponse(id: number): void;
}

export default class Question extends React.Component<QuestionProps> {

	constructor(props: QuestionProps) {
		super(props);
	}

	@bind
	private onRadioPress(id: number) {
		return () => {
			this.props.onSelectResponse(id);
		};
	}

	render() {
		const responseRadios = this.props.responses.map(response => (
			<CheckBox
				center={false}
				title={response.answer}
				checked={this.props.selectedId === response.id}
				checkedIcon='dot-circle-o'
				uncheckedIcon='circle-o'
				onPress={this.onRadioPress(response.id)}
				key={response.id.toString()}
			/>
		));
		return (
			<View style={styles.container}>
				<Text style={[typography.h3, styles.text]}>{this.props.question}</Text>
				{responseRadios}
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		minHeight: 200
	},
	text: {
		alignSelf: 'center'
	}
});
