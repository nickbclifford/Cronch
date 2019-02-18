import bind from 'bind-decorator';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';

import { QuestionInfo } from '../common/Questionnaires';
import { NEUTRAL, nunito, PRIMARY, typography } from '../common/StyleGuide';

export interface QuestionProps extends QuestionInfo {
	selectedId: number | null;
	onSelectResponse(id: number): void;
}

export default class Question extends React.Component<QuestionProps> {

	@bind
	private onRadioPress(id: number) {
		return () => {
			this.props.onSelectResponse(id);
		};
	}

	render() {
		const checkedIcon = (
			<Icon
				name='check'
				type='font-awesome'
				size={20}
				color={PRIMARY[700]}
				containerStyle={styles.emptyIcon}
			/>
		);

		// color={NEUTRAL[900]}

		const emptyIcon = (
			<View style={styles.emptyIcon} />
		);

		const responseRadios = this.props.responses.map(response => (
			<CheckBox
				center={false}
				title={response.answer}
				checked={this.props.selectedId === response.id}
				checkedIcon={checkedIcon}
				uncheckedIcon={emptyIcon}
				containerStyle={styles.option}
				textStyle={[typography.body]}
				onPress={this.onRadioPress(response.id)}
				key={response.id.toString()}
			/>
		));
		return (
			<View style={styles.container}>
				<Text style={[typography.h2, nunito.bold, styles.text]}>{this.props.question}</Text>
				{responseRadios}
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between'
	},
	text: {
		marginBottom: 32
	},
	option: {
		margin: 0,
		marginLeft: 0,
		marginRight: 0,
		marginBottom: 8,
		backgroundColor: NEUTRAL[300],
		borderWidth: 0
	},
	emptyIcon: {
		width: 20
	}
});
