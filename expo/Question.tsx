import bind from 'bind-decorator';
import * as React from 'react';
import { Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';

export interface QuestionProps {
	question: string;
	responses: string[];
	onSelectResponse(index: number): void;
}

export interface QuestionState {
	selectedIndex: number | null;
}

export default class Question extends React.Component<QuestionProps, QuestionState> {

	constructor(props: QuestionProps) {
		super(props);
		this.state = {
			selectedIndex: null
		};
	}

	@bind
	private onRadioPress(index: number) {
		return () => {
			this.setState({ selectedIndex: index });
			this.props.onSelectResponse(index);
		};
	}

	render() {
		const responseRadios = this.props.responses.map((res, i) => (
			<CheckBox
				center={true}
				title={res}
				checked={this.state.selectedIndex === i}
				checkedIcon='dot-circle-o'
				uncheckedIcon='circle-o'
				onPress={this.onRadioPress(i)}
				key={i.toString()}
			/>
		));
		return (
			<View>
				<Text>{this.props.question}</Text>
				{responseRadios}
			</View>
		);
	}

}
