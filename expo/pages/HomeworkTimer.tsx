import bind from 'bind-decorator';
import { Audio, KeepAwake } from 'expo';
import moment from 'moment';
import * as React from 'react';
import { Alert, StatusBar, StyleSheet, Text, Vibration, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import Sentry from 'sentry-expo';

import { alarmList } from '../common/Alarms';
import withAssignmentContext, { WithAssignmentContextProps } from '../common/AssignmentContext';
import MyMICDS from '../common/MyMICDS';
import flipped$ from '../common/PhoneAcrobatics';
import { components, NEUTRAL, PRIMARY, typography } from '../common/StyleGuide';
import Task from '../common/Task';
import { createTimeslot, endTimeslot, Timeslot } from '../common/Timeslot';
import { getUser, getUserTimers, User } from '../common/User';
import { Omit } from '../common/Utils';
import Circle from '../components/Circle';
import DisplayAssignment from '../components/DisplayAssignment';

export interface TimerState {
	maxWorkTime: number;
	maxBreakTime: number;
	workTimeLeft: number;
	breakTimeLeft: number;
	onBreak: boolean;
	paused: boolean;
	alarmSelection: number;
	modeSelection: number;
	flipped: boolean;
	assignment: Task;
	currentTimeslotId: number | null;
	vibrateDuration: number;
}

export class HomeworkTimer extends React.Component<NavigationScreenProps & WithAssignmentContextProps, TimerState> {

	// static navigationOptions = ({ navigation }) => {
	// 	const task: Task = navigation.getParam('assignment');
	//
	// 	const navigateToBattlePlan = () => {
	// 		navigation.navigate('BattlePlan');
	// 	};
	//
	// 	return {
	// 		headerStyle: {
	// 			backgroundColor: task.class.color,
	// 			height: 144
	// 		},
	// 		headerTintColor: task.class.textDark ? NEUTRAL[900] : NEUTRAL[100],
	// 		headerTitle: <DisplayTask task={navigation.getParam('assignment')}/>,
	// 		headerLeft: (
	// 			<TouchableOpacity onPress={navigateToBattlePlan} style={styles.backButton}>
	// 				<Icon name='angle-left' type='font-awesome' color={task.class.textDark ? NEUTRAL[900] : NEUTRAL[100]}/>
	// 			</TouchableOpacity>
	// 		)
	// 		// headerLeftContainerStyle: styles.backButtonContainer
	// 	};
	// }

	static navigationOptions = {
		header: null
	};

	private interval!: NodeJS.Timer;

	private user!: User;

	constructor(props: any) {
		super(props);
		this.state = {
			maxBreakTime: 15 * 60 * 1000,
			maxWorkTime: 45 * 60 * 1000,
			workTimeLeft: 0.1 * 60 * 1000,
			breakTimeLeft: 0.1 * 60 * 1000,
			// workTimeLeft: 10 * 1000,
			// breakTimeLeft: 10 * 1000,
			onBreak: false,
			paused: true,
			alarmSelection: 0,
			modeSelection: 0,
			flipped: false,
			assignment: this.props.navigation.getParam('assignment'),
			currentTimeslotId: null,
			vibrateDuration: 500
		};

		// this.props.navigation.state.params.classColor = this.state.assignment.class.color;

		// console.log(this.props.navigation.state.params.classColor);
	}

	async componentDidMount() {

		this.props.navigation.setParams({
			assignment: this.state.assignment
		});

		let startTime = new Date().valueOf();
		this.interval = setInterval(() => {
			const currentTime = new Date().valueOf();
			const timeLapsed = currentTime - startTime;
			startTime = currentTime;

			if (!this.state.paused) {
				if (this.state.modeSelection === -1) {
					this.tickManual(timeLapsed);
				} else {
					this.tick(timeLapsed);
				}
			}
		}, 500);

		flipped$.subscribe(flipped => {
			this.setState({
				flipped
			});

			// Only pause when user is not on break
			if (!this.state.onBreak && this.state.modeSelection !== -1) {
				console.log('Flipped?', flipped);
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

		getUser()
			.then(res => {
				if (!res.user) { return new Error('User does not exist'); }

				this.user = res.user;

				// YUH
				this.setState({
					alarmSelection: res.user.alarmSelection,
					modeSelection: res.user.timerSelection
				});
			})
			.then(() => getUserTimers())
			.then(timers => {
				console.log(timers);
				const selectedTimer = timers[this.user.timerSelection];

				// YUH
				// if (selectedTimer) {
				// 	this.setTimerMode({
				// 		maxBreakTime: selectedTimer.break,
				// 		maxWorkTime: selectedTimer.work,
				// 		modeSelection: this.user.timerSelection
				// 	});
				// }
			})
			.catch(err => {
				Sentry.captureException(err);
				Alert.alert('Error getting user', err.message);
			});

		KeepAwake.activate();
	}

	componentWillUnmount() {
		clearInterval(this.interval);
		// TODO: Custom events bb
		this.endRecordTimeslot();
	}

	componentWillUpdate(nextProps: any, nextState: TimerState) {
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
	private async playAlarm() {
		/** @todo Get alarm preference from backend */

		await Audio.setAudioModeAsync({
			playsInSilentModeIOS: true,
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			shouldDuckAndroid: false,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			playThroughEarpieceAndroid: true
		} as any);

		const soundObject = new Audio.Sound();
		const soundFile = alarmList[this.state.alarmSelection].file;
		await soundObject.loadAsync(soundFile);
		await soundObject.setIsLoopingAsync(true);
		await soundObject.setPositionAsync(0);
		await soundObject.playAsync();
		return soundObject;
	}

	@bind
	async tick(timeLapsed: number) {
		if (this.state.onBreak) {
			this.setState({
				breakTimeLeft: this.state.breakTimeLeft - timeLapsed
			});

			// Reset and switch when timer reaches 0
			if (this.state.breakTimeLeft <= 0) {
				this.setState({
					paused: true,
					breakTimeLeft: 0
				});

				let soundObject: Audio.Sound;
				try {
					soundObject = await this.playAlarm();
				} catch (err) {
					Sentry.captureException(err);
					Alert.alert('Error Playing Sound', err.message);
				}
				this.vibratePhone();
				Alert.alert(
					'Time for work!',
					'',
					[
						{ text: 'Continue', onPress: () => {
							this.setState({
								breakTimeLeft: this.state.maxBreakTime,
								onBreak: false,
								paused: true
							});
							if (soundObject) {
								soundObject.stopAsync();
							}
							this.cancelVibrate();
						} }
					]
				);
			}
		} else {
			this.setState({
				workTimeLeft: this.state.workTimeLeft - timeLapsed
			});

			if (this.state.workTimeLeft <= 0) {
				this.setState({
					paused: true,
					workTimeLeft: 0
				});

				let soundObject: Audio.Sound;
				try {
					soundObject = await this.playAlarm();
				} catch (err) {
					Sentry.captureException(err);
					Alert.alert('Error Playing Sound', err.message);
				}
				this.vibratePhone();
				Alert.alert(
					'Time for a break!',
					`Continue for your ${this.state.maxBreakTime / 60000}-minute break`,
					[
						{ text: 'Continue', onPress: () => {
							this.setState({
								workTimeLeft: this.state.maxWorkTime,
								onBreak: true,
								paused: false
							});
							if (soundObject) {
								soundObject.stopAsync();
							}
							this.cancelVibrate();
						} }
					]
				);
			}
		}
	}

	@bind
	tickManual(timeLapsed: number) {
		if (this.state.onBreak) {
			this.setState({
				breakTimeLeft: this.state.breakTimeLeft + timeLapsed
			});

		} else {
			this.setState({
				workTimeLeft: this.state.workTimeLeft + timeLapsed
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
			console.log(`Timeslot started for task id ${timeslot.classId}`);
		}).catch(err => {
			err => Sentry.captureException(err);
			Alert.alert('Error saving time slot.', err.message);
		});
	}

	@bind
	private endRecordTimeslot() {
		if (this.state.currentTimeslotId) {
			return endTimeslot(this.state.currentTimeslotId, new Date())
			.then(() => {
				console.log(`Timeslot ended for task id ${this.state.currentTimeslotId}`);
				this.setState({ currentTimeslotId: null });
			})
			.catch(err => {
				Sentry.captureException(err);
				Alert.alert('Error ending time slot.', err.message);
			});
		}
	}

	@bind
	private navigateToAssignmentDetails(assignment: Task) {
		this.props.navigation.navigate('AssignmentDetails', { assignment, neuter: true });
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

	@bind
	private nextAssignment() {
		const assignmentList = this.props.assignmentContext.assignments;
		const currentIndex = assignmentList.indexOf(this.state.assignment);
		console.log(currentIndex, 'indexNumber', assignmentList.length, 'assignmentListLength');
		let nextIndex = currentIndex + 1;
		if (nextIndex === assignmentList.length) {
			nextIndex = 0;
		}
		this.setState({
			assignment: assignmentList[nextIndex],
			paused: true
		});
		setTimeout(this.endRecordTimeslot);
		setTimeout(this.updateHeader);
		// THIS IS FOR CHECKING WHETHER IT IS CHECKED, SHOULD DO IT SOMEWHERE ELSE
		// for (let i = 0; i < assignmentList.length; i++) {
		// 	if (currentIndex === assignmentList.length - 1) {
		// 		nextIndex = 0;
		// 		console.log('finishedLoop');
		// 	}
		// 	// if (assignmentList[nextIndex].checked) {
		// 	// 	currentIndex = nextIndex;
		// 	// 	nextIndex += 1;
		// 	// 	console.log('already checked');
		// 	// } else {
		// 		console.log(assignmentList[nextIndex], 'nextIndex');
		// 		this.setState({
		// 			assignment: assignmentList[nextIndex]
		// 		});
		// 		this.updateHeader();
		// 		// break;
		// 	// }
		// 	// if finished and all have checked
		// 	if (i === assignmentList.length - 1) {
		// 		this.navigateToBattlePlan();
		// 	}
		// }
	}

	@bind
	private previousAssignment() {
		const assignmentList = this.props.assignmentContext.assignments;
		const currentIndex = assignmentList.indexOf(this.state.assignment);
		let nextIndex = currentIndex - 1;
		if (currentIndex === 0) {
			nextIndex = assignmentList.length - 1;
		}
		this.setState({
			assignment: assignmentList[nextIndex],
			paused: true
		});
		setTimeout(this.endRecordTimeslot);
		setTimeout(this.updateHeader);
	}

	@bind
	private doneAssignment() {
		const tempID = this.state.assignment._id;
		if (this.props.assignmentContext.assignments.length > 1) {
			this.nextAssignment();
		} else {
			this.endRecordTimeslot();
		}
		MyMICDS.planner.checkEvent({ id: tempID }).subscribe(
			() => {
				this.props.assignmentContext.deleteAssignment(tempID);
				if (this.props.assignmentContext.assignments.length === 0) {
					this.navigateToBattlePlan();
				}
			},
			err => Sentry.captureException(err)
		);
	}

	@bind
	private updateHeader() {
		console.log(this.state.assignment.title, 'updated header');
		this.props.navigation.setParams({
			assignment: this.state.assignment
		});
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<KeepAwake/>
				<StatusBar barStyle='dark-content' animated={true} />
				<DisplayAssignment
					assignment={this.state.assignment}
					rightIcon='info-circle'
					onAssignmentClick={this.navigateToAssignmentDetails}
					itemStyle={styles.currentTask}
				/>
				<View style={styles.container}>
					<Circle color={PRIMARY[100]} containerStyle={[styles.circles, styles.largeCircle]} />
					<Circle color={PRIMARY[300]} containerStyle={[styles.circles, styles.mediumCircle]} />
					<Circle color={PRIMARY[500]} containerStyle={[styles.circles, styles.smallCircle]} />
					{!this.state.onBreak && (
						<View style={styles.timerContainer}>
							<Text style={[typography.h1, styles.timerLabel]}>Time Left</Text>
							<Text style={[typography.h0, styles.timerTime]}>{this.formatTime(this.state.workTimeLeft)}</Text>
							<Icon name='gear' type='font-awesome' size={50} color={NEUTRAL[300]}/>
						</View>
					)}
					{this.state.onBreak && (
						<View style={styles.timerContainer}>
							<Text style={[typography.h1, styles.timerLabel]}>Time Left</Text>
							<Text style={[typography.h0, styles.timerTime]}>{this.formatTime(this.state.breakTimeLeft)}</Text>
							<Icon name='gear' type='font-awesome' size={50} color={NEUTRAL[300]}/>
						</View>
					)}
				</View>
				<View style={styles.actions}>
					{!this.state.onBreak && (
						<View style={styles.flippyContainer}>
							<Icon
								name='refresh'
								type='font-awesome'
								size={20}
								color={NEUTRAL[500]}
							/>
							<Text style={[typography.small, styles.flippy]}>Place your phone face-down to start the timer!</Text>
						</View>
					)}
					{/*<Button
						title='Change Timer'
						buttonStyle={components.buttonStyle}
						titleStyle={components.buttonText}
						onPress={this.addCustom}
					/>*/}
					<Button
						title='Change Assignment'
						containerStyle={styles.changeAssignment}
						buttonStyle={components.buttonStyle}
						titleStyle={components.buttonText}
						onPress={this.navigateToBattlePlan}
					/>
					<Button
						title='Complete Assignment'
						buttonStyle={components.buttonStyle}
						titleStyle={components.buttonText}
						onPress={this.doneAssignment}
					/>
				</View>
			</SafeAreaView>
		);
	}

	// render() {
	// 	return (
	// 		<SafeAreaView style={styles.safeArea}>
	// 			<View style={styles.displayAssignments}>
	// 				{this.state.onBreak ?
	// 					<Text>Break</Text> :
	// 					<Text>Work</Text>
	// 				}
	// 			</View>
	//
	// 			<View style={styles.timerContainer}>
	// 				<View style={styles.timer}>
	// 				{/* {!this.state.onBreak ? */}
	// 					<Text style={[typography.h1, styles.timerText]}>{this.formatTime(this.state.workTimeLeft)}</Text>
	// 					<Text style={[typography.h1, styles.timerText]}>{this.formatTime(this.state.breakTimeLeft)}</Text>
	// 				{/* } */}
	// 				</View>
	// 			</View>
	//
	// 			<Button
	// 				title='Add Custom'
	// 				onPress={this.addCustom}
	// 				buttonStyle={components.buttonStyle}
	// 				titleStyle={components.buttonText}
	// 			/>
	//
	// 			<Text>{this.state.paused.toString()}</Text>
	// 			<Text>{this.state.flipped.toString()}</Text>
	//
		// <View style={styles.buttonContainer}>
		// 	<Button
		// 		title='Previous'
		// 		raised={true}
		// 		onPress={this.previousAssignment}
		// 		style={styles.navButton}
		// 		buttonStyle={components.buttonStyle}
		// 		titleStyle={components.buttonText}
		// 	/>
		// 	<Button
		// 		title='Done'
		// 		raised={true}
		// 		onPress={this.doneAssignment}
		// 		style={styles.navButton}
		// 		buttonStyle={components.buttonStyle}
		// 		titleStyle={components.buttonText}
		// 	/>
		// 	<Button
		// 		title='Next'
		// 		raised={true}
		// 		onPress={this.nextAssignment}
		// 		style={styles.navButton}
		// 		buttonStyle={components.buttonStyle}
		// 		titleStyle={components.buttonText}
		// 	/>
		// </View>

	// 			<View style={styles.flipNotification}>
	// 				{ this.state.paused && (
	// 					<Button
	// 						title='Flip phone to start your timer!'
	// 						style={styles.flipNotificationText}
	// 						buttonStyle={components.buttonStyle}
	// 						titleStyle={components.buttonText}
	// 					/>
	// 				) }
	// 			</View>
	// 		</SafeAreaView>
	// 	);
	// }
}

export default withAssignmentContext(HomeworkTimer);

const styles = StyleSheet.create({
	safeArea: {
		height: '100%',
		padding: 8,
		display: 'flex'
	},
	currentTask: {
		marginTop: 8
	},
	container: {
		flexGrow: 1,
		flexShrink: 1,
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	timerContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	timerLabel: {
		textAlign: 'center',
		color: NEUTRAL[300],
		height: 50
	},
	timerTime: {
		textAlign: 'center',
		color: NEUTRAL[100]
	},
	circles: {
		position: 'absolute'
	},
	smallCircle: {
		width: '70%'
	},
	mediumCircle: {
		width: '97.5%'
	},
	largeCircle: {
		width: '120%'
	},
	actions: {
		flexGrow: 0,
		flexShrink: 0
	},
	flippyContainer: {
		marginBottom: 16,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	flippy: {
		marginLeft: 8,
		color: NEUTRAL[500]
	},
	changeAssignment: {
		marginBottom: 8
	}
});

const oldStyles = StyleSheet.create({
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
	buttonContainer: {
		display: 'flex',
		flexDirection: 'row'
	},
	navButton: {
		width: '33%',
		height: '20%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	flipNotificationText: {
		width: '80%'
	}
});
