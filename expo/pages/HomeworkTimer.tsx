import { CanvasEvent } from '@mymicds/sdk';
import bind from 'bind-decorator';
import { Audio, PlaybackSource } from 'expo';
import moment from 'moment';
import * as React from 'react';
import { Alert, Picker, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import { alarmList } from '../common/Alarms';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import flipped$ from '../common/PhoneAcrobatics';
import { ColorPalette, components, NEUTRAL, PRIMARY, typography } from '../common/StyleGuide';
import Task from '../common/Task';
import { Timer } from '../common/Timer';
import { createTimeslot, endTimeslot, Timeslot } from '../common/Timeslot';
import { getUser, getUserTimers, User } from '../common/User';
import { Omit } from '../common/Utils';
import DisplayTask from '../components/DisplayTask';

export interface TimerState {
	maxWorkTime: number;
	maxBreakTime: number;
	workTimeLeft: number;
	breakTimeLeft: number;
	onBreak: boolean;
	paused: boolean;
	modeSelection: number;
	alarmSelection: number;
	flipped: boolean;
	assignment: Task;
	currentTimeslotId: number | null;
	vibrateDuration: number;
}

export default class HomeorkTimer extends React.Component<NavigationScreenProps, TimerState> {

	static navigationOptions = ({ navigation }) => {
		const task: Task = navigation.getParam('assignment');

		const navigateToBattlePlan = () => {
			navigation.navigate('BattlePlan');
		};

		return {
			headerStyle: {
				backgroundColor: task.class.color,
				height: 144
			},
			headerTintColor: task.class.textDark ? NEUTRAL[900] : NEUTRAL[100],
			headerTitle: <DisplayTask task={navigation.getParam('assignment')}/>,
			headerLeft: (
				<TouchableOpacity onPress={navigateToBattlePlan} style={styles.backButton}>
					<Icon name='angle-left' type='font-awesome' color={task.class.textDark ? NEUTRAL[900] : NEUTRAL[100]}/>
				</TouchableOpacity>
			)
			// headerLeftContainerStyle: styles.backButtonContainer
		};
	}

	private interval!: NodeJS.Timer;

	private user!: User;

	constructor(props: any) {
		super(props);

		this.state = {
			maxBreakTime: 15 * 60 * 1000,
			maxWorkTime: 45 * 60 * 1000,
			workTimeLeft: 0,
			breakTimeLeft: 0,
			onBreak: false,
			paused: true,
			modeSelection: 0,
			flipped: false,
			assignment: this.props.navigation.getParam('assignment'),
			currentTimeslotId: null,
			vibrateDuration: 500,
			alarmSelection: 0
		};

		// this.props.navigation.state.params.classColor = this.state.assignment.class.color;

		// console.log(this.props.navigation.state.params.classColor);
	}

	async componentDidMount() {

		this.props.navigation.setParams({
			assignment: this.state.assignment
		});

		this.interval = setInterval(() => {
			if (!this.state.paused) {
				if (this.state.modeSelection === -1) {
					this.tickManual();
				} else {
					this.tick();
				}
			}
		}, 1000);

		flipped$.subscribe(flipped => {
			this.setState({
				flipped
			});

			// Only pause when user is not on break
			if (!this.state.onBreak && this.state.modeSelection !== -1) {
				console.log('buh', flipped);
				this.setState({ paused: !flipped });
			}

			// If user is using manual, switch to break when phone faces upward
			if (this.state.modeSelection === -1) {
				if (flipped) {
					this.setState({ paused: false });
				}
				this.setState({ onBreak: !flipped });
			}
		});

		this.prepareSound();

		getUser()
			.then(res => {
				if (!res.user) { return new Error('User does not exist'); }

				console.log(res.user);
				this.user = res.user;

				this.setState({
					alarmSelection: res.user.alarmSelection,
					modeSelection: res.user.timerSelection
				});
			})
			.then(() => getUserTimers())
			.then(timers => {
				console.log(timers);
				const selectedTimer = timers[this.user.timerSelection];

				if (selectedTimer) {
					this.setTimerMode({
						maxBreakTime: selectedTimer.break,
						maxWorkTime: selectedTimer.work,
						modeSelection: this.user.timerSelection
					});
				}
			})
			.catch(e => {
				Alert.alert('Error getting user', e.message);
			});
	}

	componentWillUnmount() {
		clearInterval(this.interval);
		// TODO: Custom events bb
		this.endRecordTimeslot();
	}

	componentWillUpdate(nextProps: any, nextState: any) {
		console.log(this.state.paused, nextState.paused);
		if (this.state.paused !== nextState.paused) {
			if (this.state.paused) {
				this.startRecordTimeslot();
			} else {
				this.endRecordTimeslot();
			}
		}
	}

	@bind
	private navigateToBattlePlan() {
		this.props.navigation.navigate('BattlePlan');
	}

	@bind
	private addCustom() {
		this.props.navigation.navigate('ModeSelection', {
			setTimerMode: this.setTimerMode
		});
	}

	@bind
	private togglePause() {
		this.setState({
			paused: !this.state.paused
		});
	}

	@bind
	private setTimerMode(mode: { maxWorkTime: number, maxBreakTime: number, modeSelection: number }) {
		this.setState({
			maxWorkTime: mode.maxWorkTime,
			maxBreakTime: mode.maxBreakTime,
			workTimeLeft: mode.maxWorkTime,
			breakTimeLeft: mode.maxBreakTime,
			onBreak: false,
			paused: !this.state.flipped,
			modeSelection: mode.modeSelection
		});
	}

	@bind
	private async playAlarm(soundObject: Audio.Sound) {
		// get alarm preference from backend
		try {
			const soundFile = alarmList[this.state.alarmSelection].file;
			await soundObject.loadAsync(soundFile);
			await soundObject.setIsLoopingAsync(true);
			await soundObject.setPositionAsync(0);
			await soundObject.playAsync();
		} catch (error) {
			Alert.alert('sound buh', error.message);
		}
	}

	@bind
	tick() {
		if (this.state.onBreak) {
			this.setState({
				breakTimeLeft: this.state.breakTimeLeft - 1000
			});

			// Reset and switch when timer reaches 0
			if (this.state.breakTimeLeft <= 0) {
				this.setState({
					paused: true
				});
				const soundObject = new Audio.Sound();
				this.playAlarm(soundObject);
				this.vibratePhone();
				Alert.alert(
					'Time for work!',
					'Yuhyuhyuh',
					[
						{ text: 'Continue', onPress: () => {
							this.setState({
								breakTimeLeft: this.state.maxBreakTime,
								onBreak: false,
								paused: true
							});
							soundObject.stopAsync();
							this.cancelVibrate();
						} }
					]
				);
			}
		} else {
			this.setState({
				workTimeLeft: this.state.workTimeLeft - 1000
			});

			if (this.state.workTimeLeft <= 0) {
				this.setState({
					paused: true
				});
				const soundObject = new Audio.Sound();
				this.playAlarm(soundObject);
				this.vibratePhone();
				Alert.alert(
					'Time for a break!',
					'Please select an option',
					[
						{ text: 'Continue', onPress: () => {
							this.setState({
								workTimeLeft: this.state.maxWorkTime,
								onBreak: true,
								paused: false
							});
							soundObject.stopAsync();
							this.cancelVibrate();
						} }
					]
				);
			}
		}
	}

	@bind
	tickManual() {
		if (this.state.onBreak) {
			this.setState({
				breakTimeLeft: this.state.breakTimeLeft + 1000
			});

		} else {
			this.setState({
				workTimeLeft: this.state.workTimeLeft + 1000
			});
		}
	}
	private startRecordTimeslot() {
		let timeslot: Omit<Timeslot, 'id' | 'end' | 'user'>;
		timeslot = {
			start: new Date(),
			classId: this.state.assignment._id
		};

		return createTimeslot(timeslot).then(res => {
			this.setState({ currentTimeslotId: res.id });
		})
		.then(() => {
			console.log('buh started');
		}).catch((e: any) => {
			Alert.alert('Error saving time slot.', e.message);
		});
	}

	private endRecordTimeslot() {
		if (this.state.currentTimeslotId) {
			return endTimeslot(this.state.currentTimeslotId, new Date())
			.then(() => {
				console.log('buh ended');
				this.setState({ currentTimeslotId: null });
			})
			.catch((e: any) => {
				Alert.alert('Error ending time slot.', e.message);
			});
		}
	}

	// private toggleRecordTimeslot() {
	// 	if (!this.state.currentTimeslotId) {
	// 	} else {
	// 	}
	// }
	private async prepareSound() {
		try {
			await Audio.setAudioModeAsync({
				playsInSilentModeIOS: true,
				allowsRecordingIOS: false,
				interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
				shouldDuckAndroid: true,
				interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS
			});
			// .then(err => {
			// 	console.log('this is setting audio error ', err);
			// });
		} catch (error) {
			Alert.alert('sound buh', error.message());
		}
	}

	@bind
	private navigateToAssignmentDetails(assignment: CanvasEvent) {
		this.props.navigation.navigate('AssignmentDetails', { assignment });
	}

	@bind
	private formatTime(time: number) {
		return moment(time, 'x').format('mm:ss');
	}

	@bind
	private vibratePhone() {
		Vibration.vibrate([this.state.vibrateDuration, this.state.vibrateDuration], true);
	}

	@bind
	private cancelVibrate() {
		Vibration.cancel();
	}
	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.displayAssignments}>
					{this.state.onBreak ?
						<Text>Break</Text> :
						<Text>Work</Text>
					}
				</View>

				<View style={styles.timerContainer}>
					<View style={styles.timer}>
					{/* {!this.state.onBreak ? */}
						<Text style={[typography.h1, styles.timerText]}>{this.formatTime(this.state.workTimeLeft)}</Text>
						<Text style={[typography.h1, styles.timerText]}>{this.formatTime(this.state.breakTimeLeft)}</Text>
					{/* } */}
					</View>
				</View>

				<Button
					title='Add Custom'
					onPress={this.addCustom}
					buttonStyle={components.buttonStyle}
					titleStyle={components.buttonText}
				/>

				<Text>{this.state.paused.toString()}</Text>
				<Text>{this.state.flipped.toString()}</Text>

				<View style={styles.flipNotification}>
					{ this.state.paused && (
						<Button
							title='Flip phone to start your timer!'
							style={styles.flipNotificationText}
							buttonStyle={components.buttonStyle}
							titleStyle={components.buttonText}
						/>
					) }
				</View>
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
	displayAssignments: {
		height: '20%'
	},
	header: {
		height: '20%'
	},
	backButton: {
		paddingLeft: 40,
		paddingRight: 40,
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	timer: {
		height: 200,
		width: 200,
		borderRadius: 100,
		backgroundColor: PRIMARY[700],
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	timerContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	timerText: {
		color: '#fff',
		textAlign: 'center'
	},
	flipNotification: {
		position: 'absolute',
		bottom: '5%',
		width: '100%',
		height: '20%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	flipNotificationText: {
		width: '80%'
	}
});
