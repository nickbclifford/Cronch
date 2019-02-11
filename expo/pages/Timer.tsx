import { CanvasEvent } from '@mymicds/sdk';
import bind from 'bind-decorator';
import { Audio, PlaybackSound } from 'expo';
import * as React from 'react';
import { Alert, Picker, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, NavigationStackScreenOptions, SafeAreaView } from 'react-navigation';

import flipped$ from '../common/PhoneAcrobatics';
import { components } from '../common/StyleGuide';
import Task from '../common/Task';
import { createTimeslot, endTimeslot, Timeslot } from '../common/Timeslot';
import { Omit } from '../common/Utils';
import DisplayAssignments from '../components/DisplayAssignments';

export interface TimerState {
	workTimeLeft: number;
	breakTimeLeft: number;
	onBreak: boolean;
	paused: boolean;
	modeSelection: number;
	alarmSelection: number;
	flipped: boolean;
	assignment: Task;
	currentTimeslotId: number | null;
}

export default class Timer extends React.Component<NavigationScreenProps, TimerState> {

	static navigationOptions: NavigationStackScreenOptions = {
		header: null,
		headerStyle: {
			height: '20%',
			backgroundColor: '#BADA55'
		},
		headerTintColor: '#fff'
	};

	private alarmSound = new Audio.Sound();

	private interval!: NodeJS.Timer;

	private userCycles: Array<{
		work: number,
		break: number
	}>;

	private shouldAddCycles = false;

	private alarmList: Array<{
		file: PlaybackSound,
		displayName: string
	}>;

	constructor(props: any) {
		super(props);
		Audio.setAudioModeAsync({
			playsInSilentModeIOS: true
			// interruptionModeIOS: 'INTERRUPTION_MODE_IOS_DO_NOT_MIX',
			// interruptionModeAndroid: 'INTERRUPTION_MODE_ANDROID_DUCK_OTHERS',
			// playThroughEarpieceAndroid: true
		}).then(buh => console.log('buh wait', buh));
		this.userCycles = [{
			work: 0.1 * 60 * 1000,
			break: 0.1 * 60 * 1000
		}, {
			work: 0.5 * 60 * 1000,
			break: 0.5 * 60 * 1000
		}];
		this.alarmList = [{
			file: require('../assets/alarm-sounds/2001_A_Space_Odyssey.mp3'),
			displayName: 'Space Odyssey Theme'
		}, {
			file: require('../assets/alarm-sounds/samsung_loop.mp3'),
			displayName: 'Bright and Cheery :)'
		}];
		this.state = {
			workTimeLeft: this.userCycles[0].work,
			breakTimeLeft: this.userCycles[0].break,
			onBreak: false,
			paused: true,
			modeSelection: 0,
			alarmSelection: 0,
			flipped: false,
			assignment: this.props.navigation.getParam('assignment'),
			currentTimeslotId: null
		};

		this.props.navigation.setParams({
			title: 'buh'
		});
	}

	async componentDidMount() {
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
			if (!this.state.onBreak) {
				console.log('buh', flipped);
				this.setState({ paused: !flipped });
			}
		});
		console.log(this.alarmList[0].file);
		// try {
		// 	await this.alarmSound.loadAsync(this.alarmList[0].file);
		// 	await this.alarmSound.setIsLoopingAsync(true);
		// } catch (error) {
		// 	Alert.alert('sound buh', error.message());
		// }
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

	componentDidUpdate() {
		if (this.props.navigation.getParam('shouldAddCycle')) {
			this.props.navigation.setParams({ shouldAddCycle: false });
			this.shouldAddCycles = true;
		} else {
			if (this.shouldAddCycles) {
				this.userCycles.push(this.props.navigation.getParam('addCycle'));
			}
			this.shouldAddCycles = false;
		}
	}

	@bind
	private navigateToBattlePlan() {
		this.props.navigation.navigate('BattlePlan');
	}

	@bind
	private addCustom() {
		this.props.navigation.navigate('ModeSelection');
	}

	@bind
	private togglePause() {
		this.setState({
			paused: !this.state.paused
		});
	}

	@bind
	private setTimerMode(n: number) {
		if (n === -1) {
			this.setState({
				workTimeLeft: 0,
				breakTimeLeft: 0,
				onBreak: false,
				paused: false,
				modeSelection: n
			});
		} else {
			this.setState({
				workTimeLeft: this.userCycles[n].work,
				breakTimeLeft: this.userCycles[n].break,
				onBreak: false,
				paused: false,
				modeSelection: n
			});
		}
	}

	@bind
	private async setAlarmMode(n: number) {
			this.setState({
				alarmSelection: n
			});
			// console.log(this.alarmList[n].file, this.alarmList[n].displayName);
			// const soundObject = new Audio.Sound();
			// try {
			// 	await soundObject.loadAsync(this.alarmList[this.alarmSelection].file);
			// 	console.log('swag', this.alarmList[n].file, this.alarmList[n].displayName);
			// 	await this.alarmSound.setPositionAsync(0);
			// 	await this.alarmSound.playAsync();
			// } catch (error) {
			// 	Alert.alert('sound buh', error.message());
			// }
	}

	@bind
	private async playAlarm(soundObject: Alarm.Sound) {
		try {
			await soundObject.loadAsync(this.alarmList[this.state.alarmSelection].file);
			await soundObject.setIsLoopingAsync(true);
			await soundObject.setPositionAsync(0);
			await soundObject.playAsync();
		} catch (error) {
			Alert.alert('sound buh', error.message());
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
				Alert.alert(
					'Time for work!',
					'Yuhyuhyuh',
					[
						{ text: 'Continue', onPress: () => {
							this.setState({
								breakTimeLeft: this.userCycles[this.state.modeSelection].break,
								onBreak: false,
								paused: true
							});
							soundObject.stopAsync();
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
				Alert.alert(
					'Time for a break!',
					'Please select an option',
					[
						{ text: 'Continue', onPress: () => {
							this.setState({
								workTimeLeft: this.userCycles[this.state.modeSelection].work,
								onBreak: true,
								paused: false
							});
							soundObject.stopAsync();
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

	@bind
	private navigateToAssignmentDetails(assignment: CanvasEvent) {
		this.props.navigation.navigate('AssignmentDetails', { assignment });
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.displayAssignments}>
					{/* Use the DisplayTask component */}
					{/* <DisplayAssignments
						navigation={this.props.navigation}
						assignments={[this.state.assignment]}
						headers={false}
						sort={false}
						reorder={false}
						paddingTop={0}
						paddingRight={8}
						paddingLeft={8}
						paddingBottom={0}
						onAssignmentClick={this.navigateToAssignmentDetails}
					/> */}
				</View>
				{/* <Button
					title='Create Battle Plan'
					onPress={this.navigateToBattlePlan}
				/> */}

				<Button title='Add Custom' onPress={this.addCustom}/>
				<Picker
					selectedValue={this.state.modeSelection}
					onValueChange={this.setTimerMode}
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
				<Picker
					selectedValue={this.state.alarmSelection}
					onValueChange={this.setAlarmMode}
				>
					{this.alarmList.map((cycle, i) =>
						<Picker.Item
							key={i}
							label={cycle.displayName}
							value={i}
						/>
					)}
				</Picker>
				<Text>{this.state.assignment.title}</Text>

				<Text>Work Timer: {Math.floor(this.state.workTimeLeft / 60000)}:{Math.floor(this.state.workTimeLeft % 60000)}</Text>
				<Text>Break Timer: {Math.floor(this.state.breakTimeLeft / 60000)}:{Math.floor(this.state.breakTimeLeft % 60000)}</Text>
				<Text>{this.state.paused.toString()}</Text>
				<Text>{this.state.flipped.toString()}</Text>

				{ this.state.paused && (
					<Button title='Flip phone to start your timer!' style={components.buttonStyle}/>
				) }
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
	}
});
