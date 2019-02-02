import { CanvasEvent } from '@mymicds/sdk';
import bind from 'bind-decorator';
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import Hamburger from '../components/Hamburger';

export interface TimerState {
}

let mockAssignment: {
	canvasEvent: CanvasEvent,
	timeLength: number,
	done: boolean
};

export default class Timer extends React.Component<NavigationScreenProps, TimerState> {

	static navigationOptions = {
		header: null
	};

	constructor(props: any) {
		super(props);
		this.state = {};

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
			// tslint:enable:max-line-length
			timeLength: 45 * 60,
			done: false
		};
	}

	@bind
	private navigateToBattlePlan() {
		this.props.navigation.navigate('BattlePlan');
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
				<Button title='Pause'/>
				<Button title='+ Cycle'/>
				<Button title='- Cycle'/>
				<Text>{mockAssignment.canvasEvent.title}</Text>
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
