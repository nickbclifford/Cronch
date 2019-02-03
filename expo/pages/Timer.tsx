import { CanvasEvent } from '@mymicds/sdk';
import bind from 'bind-decorator';
import * as React from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import { gyro$ } from '../common/PhoneAcrobatics';
import Hamburger from '../components/Hamburger';

export interface TimerState {
	workTimeLeft: number;
	breakTimeLeft: number;
	onBreak: boolean;
	paused: boolean;
	manual: boolean;
}

let mockAssignment: {
	canvasEvent: CanvasEvent,
	// recommendedTime: number,
	timeSpent: number,
	done: boolean
};

let userPreferredCycles: {
	work: number,
	break: number
};

export default class Timer extends React.Component<NavigationScreenProps, TimerState> {

	static navigationOptions = {
		header: null
	};

	private interval = 0;

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

		userPreferredCycles = {
			work: 0.1 * 60 * 1000,
			break: 0.1 * 60 * 1000
		};

		this.state = {
			workTimeLeft: userPreferredCycles.work,
			breakTimeLeft: userPreferredCycles.break,
			onBreak: false,
			paused: false,
			manual: false
		};
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			if (!this.state.paused && !this.state.onBreak) {
				this.tick();
			}
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	@bind
	private navigateToBattlePlan() {
		this.props.navigation.navigate('BattlePlan');
	}

	@bind
	private addCustom() {
		return;
	}

	@bind
	private pause() {
		this.setState({
			paused: true
		});
	}

	@bind
	private toggleManual() {

	}

	@bind
	tick() {
		if (this.state.onBreak) {
			this.setState({
				breakTimeLeft: this.state.breakTimeLeft - 1000
			});

			if (this.state.breakTimeLeft <= 0) {
				this.setState({
					breakTimeLeft: userPreferredCycles.break,
					onBreak: false
				});
			}
		} else {
			this.setState({
				workTimeLeft: this.state.workTimeLeft - 1000
			});
			if (this.state.workTimeLeft <= 0) {
				this.setState({
					workTimeLeft: userPreferredCycles.work,
					onBreak: true
				});
			}
		}
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<Button
					title='Create Battle Plan'
					onPress={this.navigateToBattlePlan}
				/>
				<Button title='Start'/>
				<Button title='Pause' onPress={this.pause}/>
				<Button title='Add Custom' onPress={this.addCustom}/>
				<Text>{mockAssignment.canvasEvent.title}</Text>

				<Text>Work Timer: {Math.floor(this.state.workTimeLeft / 60000)}:{Math.floor(this.state.workTimeLeft % 60000)}</Text>
				<Text>Break Timer: {Math.floor(this.state.breakTimeLeft / 60000)}:{Math.floor(this.state.breakTimeLeft % 60000)}</Text>
				<Text>{this.state.paused.toString()}</Text>
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
