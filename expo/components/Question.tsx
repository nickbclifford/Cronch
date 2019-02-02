import bind from 'bind-decorator';
import * as React from 'react';
import { Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';

export interface QuestionInfo {
	question: string;
	responses: string[];
}

export interface QuestionProps extends QuestionInfo {
	selectedIndex: number | null;
	onSelectResponse(index: number): void;
}

export default class Question extends React.Component<QuestionProps> {

	constructor(props: QuestionProps) {
		super(props);
	}

	@bind
	private onRadioPress(index: number) {
		return () => {
			this.props.onSelectResponse(index);
		};
	}

	render() {
		const responseRadios = this.props.responses.map((res, i) => (
			<CheckBox
				center={true}
				title={res}
				checked={this.props.selectedIndex === i}
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