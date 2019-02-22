import bind from 'bind-decorator';
import * as React from 'react';
import { ScrollView, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';

import { QuestionInfo } from '../common/Questionnaires';
import { NEUTRAL, nunito, PRIMARY, typography } from '../common/StyleGuide';

export interface QuestionProps extends QuestionInfo {
	selectedId: number | null;
	onSelectResponse(id: number): void;
	expandable?: boolean;
	containerStyle?: StyleProp<ViewStyle>;
}

interface QuestionState {
	expanded: boolean;
}

export default class Question extends React.Component<QuestionProps, QuestionState> {

	constructor(props: QuestionProps) {
		super(props);
		this.state = {
			expanded: false
		};
	}

	@bind
	private onRadioPress(id: number) {
		return () => {
			this.props.onSelectResponse(id);
		};
	}

	@bind
	private onExpandPress() {
		this.setState({
			expanded: !this.state.expanded
		});
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

		const expandChevron = this.state.expanded ?
			(
			<Icon
				name='chevron-down'
				type='font-awesome'
				size={20}
				color={PRIMARY[700]}
				containerStyle={{ paddingRight: 20 }}
			/>
			) :
			(
			<Icon
				name='chevron-up'
				type='font-awesome'
				size={20}
				color={PRIMARY[700]}
				containerStyle={{ paddingRight: 20 }}
			/>
			);

		const questionTitle = this.props.expandable ? (
			<TouchableOpacity style={styles.questionTitle} onPress={this.onExpandPress}>
				<Text style={[typography.h2, nunito.bold, styles.text]}>{this.props.question}</Text>
				{expandChevron}
			</TouchableOpacity>
		) :
		(
			<View style={styles.questionTitle}>
				<Text style={[typography.h2, nunito.bold, styles.text]}>{this.props.question}</Text>
			</View>
		);

		return (
			<View style={[styles.container, this.props.containerStyle]}>
				{questionTitle}
				<View style={styles.options}>
					{this.state.expanded && responseRadios}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		maxWidth: '100%',
		display: 'flex',
		justifyContent: 'space-between'
	},
	questionTitle: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 32
	},
	text: {
		flexShrink: 2
	},
	options: {
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
