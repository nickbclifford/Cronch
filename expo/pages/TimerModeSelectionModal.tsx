import bind from 'bind-decorator';
import { Formik } from 'formik';
import * as React from 'react';
import { Alert, Picker, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import { components } from '../common/StyleGuide';
import { Timer, updateTimers } from '../common/Timer';
import { changeUserInfo, getUser, getUserTimers } from '../common/User';
import { handleFieldChangeFactory, Omit } from '../common/Utils';
import ListSelect from '../components/ListSelect';

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

interface TimerModeSelectionState {
	userCycles: Timer[];
}

export default class TimerModeSelection extends React.Component<NavigationScreenProps, TimerModeSelectionState> {

	static navigationOptions = { };

	constructor(props: NavigationScreenProps) {
		super(props);
		this.state = {
			userCycles: [{
				work: 0.1 * 60 * 1000,
				break: 0.1 * 60 * 1000
			}, {
				work: 0.5 * 60 * 1000,
				break: 0.5 * 60 * 1000
			}]
		};
	}

	componentDidMount() {

		getUserTimers().then(timers => {
			if (timers.length > 0) {
				this.setState({
					userCycles: timers
				});
			}
		})
		.catch((e: Error) => {
			Alert.alert('Error getting timers', e.message);
		});

		getUser()
			.then(res => timerSelectionInitialValues.timerSelection = res.user!.timerSelection);
	}

	@bind
	private addTimerMode(values: NewTimerValues) {
		this.setState({
			userCycles: this.state.userCycles.concat([values])
		});
	}

	@bind
	private deleteTimerMode(n: number) {
		const newTimers = this.state.userCycles;
		newTimers.splice(n, 1);
		this.setState({
			userCycles: newTimers
		});
	}

	@bind
	private setTimerMode(values: TimerSelectionValues) {
		let timerMode = {
			maxWorkTime: 0,
			maxBreakTime: 0,
			modeSelection: -1
		};

		if (values.timerSelection !== -1) {
			timerMode = {
				maxWorkTime: this.state.userCycles[values.timerSelection].work,
				maxBreakTime: this.state.userCycles[values.timerSelection].break,
				modeSelection: values.timerSelection
			};
		}

		updateTimers(
			this.state.userCycles.map(t => {
				delete t.id;
				return t;
			})
		).then(() => changeUserInfo({
			timerSelection: values.timerSelection
		}))
		.then(() => {
			this.props.navigation.state.params!.setTimerMode(timerMode);
			this.props.navigation.navigate('Timer');
		}).catch((e: Error) => {
			Alert.alert('Error creating new timer', e.message);
		});
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<ScrollView>
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
								<ListSelect
									selectedIndex={props.values.timerSelection}
									onSelectItem={handleFieldChangeFactory<TimerSelectionValues>(props, 'timerSelection')}
									items={this.state.userCycles.map((cycle, i) => {
										return {
											label: `work ${cycle.work / 60000} minutes, break ${cycle.break / 60000} minutes`,
											value: i
										};
									})}
									onDelete={this.deleteTimerMode}
								/>
								<Button
									title='Set Timer'
									onPress={props.handleSubmit as any}
									buttonStyle={components.buttonStyle}
									titleStyle={components.buttonText}
								/>
							</View>
						)}
					</Formik>
				</ScrollView>
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
