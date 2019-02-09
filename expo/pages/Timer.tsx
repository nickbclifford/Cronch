import { CanvasEvent } from '@mymicds/sdk';
import bind from 'bind-decorator';
import * as React from 'react';
import { Alert, Picker, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { createTimeslot } from '../common/Timeslot';

import flipped$ from '../common/PhoneAcrobatics';
import Hamburger from '../components/Hamburger';

export interface TimerState {
	workTimeLeft: number;
	breakTimeLeft: number;
	onBreak: boolean;
	paused: boolean;
	modeSelection: number;
	flipped: boolean;
}

let mockAssignment: {
	canvasEvent: CanvasEvent,
	// recommendedTime: number,
	timeSpent: number,
	done: boolean
};

export default class Timer extends React.Component<NavigationScreenProps, TimerState> {

	static navigationOptions = {
		header: null
	};

	private interval!: NodeJS.Timer;

	private userCycles: Array<{
		work: number,
		break: number
	}>;

	private shouldAddCycles = false;

	constructor(props: any) {
		super(props);

		mockAssignment = {
			// tslint:disable:max-line-length
			canvasEvent: JSON.parse(`{
                "_id": "event-assignment-5872379",
                "canvas": true,
                "user": "jcai",
                "class": {
                    "_id": null,
                    "canvas": true,
                    "user": "jcai",
                    "name": "MA660",
                    "teacher": {
                        "_id": null,
                        "prefix": "",
                        "firstName": "",
                        "lastName": ""
                    },
                    "type": "other",
                    "block": "other",
                    "color": "#34444F",
                    "textDark": false
                },
                "title": "Notes Arc Length and Curvature",
                "start": "2019-01-16T06:00:00.000Z",
                "end": "2019-01-16T06:00:00.000Z",
                "link": "https://micds.instructure.com/courses/1130489/assignments/5872379",
                "checked": false,
                "desc": "hehexd",
                "descPlaintext": "Our goals today are to find the arc length of a space curve and to find the curvature of a curve at a point on the curve.\\nArc Length (s)=\\nCurvature is the measure of how sharply a curve bends.\\nFormal Definition     We don't want to use the formal definition. :)\\n\\n"
            }`),
			// recommendedTime: 0.2 * 60 * 1000,
			timeSpent: 0,
			done: false
		};

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
			flipped: false
		};
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
				console.log('buh');
				this.setState({ paused: flipped });
			}

			this.recordTimeSlot().then(() => {
				console.log('buh sent');
			});
		});
	}

	componentWillUnmount() {
		clearInterval(this.interval);
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
					'Time for a break!',
					'Yuhyuhyuh',
					[
						{ text: 'Continue', onPress: () => {
							this.setState({
								breakTimeLeft: this.userCycles[this.state.modeSelection].break,
								onBreak: false,
								paused: false
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
					'Time for work!',
					'Please select an option',
					[
						{ text: 'Continue', onPress: () => {
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

	private recordTimeSlot() {
		// TODO: Custom events
		return createTimeslot(new Date(), mockAssignment.canvasEvent._id);
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
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
						<Picker.Item key={i} label={`work ${cycle.work / 60000} minutes, break ${cycle.break / 60000} minutes`} value={i}/>
					)}
					<Picker.Item key={-1} label='Manual Timer' value={-1}/>
				</Picker>
				<Text>{mockAssignment.canvasEvent.title}</Text>

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
	}
});
