import bind from 'bind-decorator';
import { Formik } from 'formik';
import * as React from 'react';
import { Alert, Picker, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { bindCallback, range } from 'rxjs';

import { components } from '../common/StyleGuide';
import { getTimers, updateTimers } from '../common/User';
import { TimerData, User } from '../common/User';
import { handleFieldChangeFactory, Omit } from '../common/Utils';

interface TimerModeSelectionState {
}

interface NewTimerValues {
	work: number;
	break: number;
}

interface TimerSelectionValues {
	timerSelection: number;
}

const timerSelectionInitialValues: TimerSelectionValues = {
	timerSelection: 0
};

const newTimerInitialValues: NewTimerValues = {
	work: 45 * 60 * 1000,
	break: 15 * 60 * 1000
};

export default class TimerModeSelection extends React.Component<NavigationScreenProps, TimerModeSelectionState> {

	static navigationOptions = {

	};

	private userCycles: Array<Omit<TimerData, 'selected'>> = [];

	constructor(props: any) {
		super(props);

		this.state = {
		};
	}

	componentDidMount() {
		this.userCycles = [{
			work: 0.1 * 60 * 1000,
			break: 0.1 * 60 * 1000
		}, {
			work: 0.5 * 60 * 1000,
			break: 0.5 * 60 * 1000
		}];

		getTimers().then(timers => {
			if (timers.length > 0) {
				this.userCycles = timers;
			}
		})
		.catch((e: Error) => {
			Alert.alert('Error getting timers', e.message);
		});
	}

	@bind
	addTimerMode(values: NewTimerValues) {
		this.userCycles.push(values);
	}

	@bind
	private setTimerMode(values: TimerSelectionValues) {
		let timerMode = {
			maxWorkTime: 0,
			maxBreakTime: 0
		};

		if (values.timerSelection !== -1) {
			timerMode = {
				maxWorkTime: this.userCycles[values.timerSelection].work,
				maxBreakTime: this.userCycles[values.timerSelection].break
			};
		}

		updateTimers(
			this.userCycles.map((c, i) => Object.assign(c, { selected: values.timerSelection === i }))
		).then(() => {
			this.props.navigation.state.params!.setTimerMode(timerMode);
			this.props.navigation.navigate('Timer');
		}).catch((e: Error) => {
			Alert.alert('Error creating new timer', e.message);
		});
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Formik
					initialValues={newTimerInitialValues}
					onSubmit={this.addTimerMode}
				>
					{props => (
					<View style={styles.newTimerContainer}>
						<Picker
							style={styles.newTimerPicker}
							selectedValue={props.values.work}
							onValueChange={handleFieldChangeFactory<NewTimerValues>(props, 'work')}
						>
							{new Array(12).fill(0).map((n, i) =>
								<Picker.Item key={i} label={`${i * 5} minutes`} value={i * 5 * 60 * 1000}/>
							)}
						</Picker>

						<Picker
							style={styles.newTimerPicker}
							selectedValue={props.values.break}
							onValueChange={handleFieldChangeFactory<NewTimerValues>(props, 'break')}
						>
							{new Array(12).fill(0).map((n, i) =>
								<Picker.Item key={i} label={`${i * 5} minutes`} value={i * 5 * 60 * 1000}/>
							)}
						</Picker>
						<Button
							title='Add'
							onPress={props.handleSubmit as any}
							buttonStyle={components.buttonStyle}
							titleStyle={components.buttonText}
						/>
					</View>
					)}
				</Formik>

				<Formik
					initialValues={timerSelectionInitialValues}
					onSubmit={this.setTimerMode}
				>
					{props => (
						<View>
							<Picker
								selectedValue={props.values.timerSelection}
								onValueChange={handleFieldChangeFactory<TimerSelectionValues>(props, 'timerSelection')}
							>
								{this.userCycles.map((cycle, i) =>
									<Picker.Item
										key={i}
										label={`work ${cycle.work / 60000} minutes, break ${cycle.break / 60000} minutes`}
										value={i}
									/>
								)}
								<Picker.Item key={-1} label='Manual Timer' value={-1}/>
							</Picker>
							<Button
								title='Set Timer'
								onPress={props.handleSubmit as any}
								buttonStyle={components.buttonStyle}
								titleStyle={components.buttonText}
							/>
						</View>
					)}
				</Formik>
			</SafeAreaView>
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
		flexGrow: 1
	}
});
