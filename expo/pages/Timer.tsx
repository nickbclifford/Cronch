import { CanvasEvent } from '@mymicds/sdk';
import bind from 'bind-decorator';
import * as React from 'react';
import { Alert, Picker, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, NavigationStackScreenOptions, SafeAreaView } from 'react-navigation';
import { TaskType } from '../common/TaskType';
import { createTimeslot, endTimeslot, Timeslot } from '../common/Timeslot';
import { Omit } from '../common/Utils';
import DisplayAssignments from '../components/DisplayAssignments';

import flipped$ from '../common/PhoneAcrobatics';
import Hamburger from '../components/Hamburger';

export interface TimerState {
	workTimeLeft: number;
	breakTimeLeft: number;
	onBreak: boolean;
	paused: boolean;
	modeSelection: number;
	flipped: boolean;
	assignment: CanvasEvent;
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

	private interval!: NodeJS.Timer;

	private userCycles: Array<{
		work: number,
		break: number
	}>;

	private shouldAddCycles = false;

	constructor(props: any) {
		super(props);

		this.userCycles = [{
			work: 0.1 * 60 * 1000,
			break: 0.1 * 60 * 1000
		}, {
			work: 0.5 * 60 * 1000,
			break: 0.5 * 60 * 1000
		}];

		this.state = {
			workTimeLeft: this.userCycles[0].work,
			breakTimeLeft: this.userCycles[0].break,
			onBreak: false,
			paused: true,
			modeSelection: 0,
			flipped: false,
			assignment: this.props.navigation.getParam('assignment'),
			currentTimeslotId: null
		};

		this.props.navigation.setParams({
			title: 'buh'
		});
	}

	componentDidMount() {
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

		this.startRecordTimeslot();
	}

	componentWillUnmount() {
		clearInterval(this.interval);
		// TODO: Custom events bb
		this.endRecordTimeslot();
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
				Alert.alert(
					'Time for work!',
					'Yuhyuhyuh',
					[
						{ text: 'Continue', onPress: () => {
							this.startRecordTimeslot();
							this.setState({
								breakTimeLeft: this.userCycles[this.state.modeSelection].break,
								onBreak: false,
								paused: true
							});
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
				Alert.alert(
					'Time for a break!',
					'Please select an option',
					[
						{ text: 'Continue', onPress: () => {
							this.endRecordTimeslot();
							this.setState({
								workTimeLeft: this.userCycles[this.state.modeSelection].work,
								onBreak: true,
								paused: false
							});
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
		const isCanvasAssignment = this.state.assignment;
		let timeslot: Omit<Timeslot, 'id' | 'end' | 'user'>;
		if (isCanvasAssignment) {
			timeslot = {
				start: new Date(),
				canvasId: this.state.assignment._id,
				taskType: TaskType.CANVAS_ASSIGNMENT,
				customTitle: null
			};
		} else {
			timeslot = {
				start: new Date(),
				canvasId: null,
				taskType: TaskType.CUSTOM,
				customTitle: 'Custom Study Time'
			};
		}
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
					<DisplayAssignments
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
					/>
				</View>
				<Button
					title='Create Battle Plan'
					onPress={this.navigateToBattlePlan}
				/>
				{ this.state.paused ? (
					<Button title='Start' onPress={this.togglePause}/>
				) : (
					<Button title='Pause' onPress={this.togglePause}/>
				)}
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
				<Text>{this.state.assignment.title}</Text>

				<Text>Work Timer: {Math.floor(this.state.workTimeLeft / 60000)}:{Math.floor(this.state.workTimeLeft % 60000)}</Text>
				<Text>Break Timer: {Math.floor(this.state.breakTimeLeft / 60000)}:{Math.floor(this.state.breakTimeLeft % 60000)}</Text>
				<Text>{this.state.paused.toString()}</Text>
				<Text>{this.state.flipped.toString()}</Text>
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
