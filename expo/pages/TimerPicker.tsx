import * as React from 'react';
import { LayoutChangeEvent, Picker, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button, Icon, Tooltip } from 'react-native-elements';

import bind from 'bind-decorator';
import { components, NEUTRAL } from '../common/StyleGuide';

interface TimerPickerProps {
	selectedWorkTime: number;
	selectedBreakTime: number;
	onChangeValue(selectedTime: { maxWorkTime: number, maxBreakTime: number }): void;
}

interface TimerPickerState {
	work: number;
	break: number;
	elementHeight: number;
	elementWidth: number;
}

export default class TimerPicker extends React.Component<TimerPickerProps, TimerPickerState> {
	constructor(props: TimerPickerProps) {
		super(props);
		this.state = {
			work: props.selectedWorkTime,
			break: props.selectedBreakTime,
			elementHeight: 300,
			elementWidth: 300
		};
	}

	componentDidUpdate(prevProps: TimerPickerProps) {
		if (this.props.selectedBreakTime !== prevProps.selectedBreakTime ||
			this.props.selectedWorkTime !== prevProps.selectedWorkTime) {
			this.setState({
				work: this.props.selectedWorkTime,
				break: this.props.selectedBreakTime
			});

		}
	}

	@bind
	changeBreak(val: number, pos: number) {
		this.setState({
			break: val
		});
	}

	@bind
	changeWork(val: number, pos: number) {
		this.setState({
			work: val
		});
	}

	@bind
	changeValueFactory(selectedTime: { maxWorkTime: number, maxBreakTime: number }) {
		return () => {
			this.props.onChangeValue(selectedTime);
		};
	}

	@bind
	getLayout(event: LayoutChangeEvent) {
		this.setState({ elementHeight: event.nativeEvent.layout.height, elementWidth: event.nativeEvent.layout.width});
	}

	render() {

		const pickers = (
			<View onLayout={this.getLayout}>
				<View style={styles.pickerLabels}>
					<Text>Work</Text>
					<Text>Break</Text>
				</View>
				<View style={styles.newTimerContainer}>
					<Picker
						style={styles.newTimerPicker}
						selectedValue={this.state.work}
						onValueChange={this.changeWork}
					>
						{new Array(12).fill(0).map((n, i) =>
							<Picker.Item key={i} label={`${(i + 1) * 5} m`} value={(i + 1) * 5 * 60 * 1000}/>
						)}
					</Picker>

					<Picker
						style={styles.newTimerPicker}
						selectedValue={this.state.break}
						onValueChange={this.changeBreak}
					>
						{new Array(12).fill(0).map((n, i) =>
							<Picker.Item key={i} label={`${(i + 1) * 5} m`} value={(i + 1) * 5 * 60 * 1000}/>
						)}
					</Picker>
				</View>
				<Button
					title='Set'
					onPress={this.changeValueFactory({
						maxWorkTime: this.state.work,
						maxBreakTime: this.state.break
					})}
					buttonStyle={components.buttonStyle}
					titleStyle={components.buttonText}
				/>
			</View>
		);

		return (
			<Tooltip
				popover={pickers}
				width={this.state.elementWidth + 40}
				height={this.state.elementHeight + 40}
				backgroundColor={NEUTRAL[100]}
			>
				<Icon name='gear' type='font-awesome' size={50} color={NEUTRAL[300]}/>
			</Tooltip>
		);
	}

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
	newTimerContainer: {
		display: 'flex',
		flexDirection: 'row'
	},
	newTimerPicker: {
		flexGrow: 1,
		margin: 5
	},
	pickerLabels: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	}
});
