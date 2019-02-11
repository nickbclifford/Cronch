import bind from 'bind-decorator';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PureChart from 'react-native-pure-chart';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { from } from 'rxjs';
import * as StyleGuide from '../common/StyleGuide';
import { getUserTimeslots } from '../common/User';

const timeslot = from(getUserTimeslots());

import Hamburger from '../components/Hamburger';
import { element } from 'prop-types';

interface AnalyticsState {
	data: any[];
	times: any[];
}

export default class Template extends React.Component<NavigationScreenProps, AnalyticsState> {

	static navigationOptions = {
		header: null
	};

	constructor(props: any) {
		super(props);
		this.state = {
			times: [],
			data: []
		};
	}

	getDayString(day: number): string {
		switch (day) {
			case 0: return 'Sunday';
			case 1: return 'Monday';
			case 2: return 'Tuesday';
			case 3: return 'Wednesday';
			case 4: return 'Thursday';
			case 5: return 'Friday';
			case 6: return 'Saturday';
			default: return 'Day';
		}
	}

	refreshData() {
		const out = [];

			// get the categories
		const categories: string[] = [];
		this.state.times.forEach(slot => {
			if (categories.indexOf(slot.classId) === -1) {
				categories.push(slot.classId);
			}
		});

		// start creating data
		const preOut: any[] = [];

		// now put the values into the categories
		for (let i = 0; i < categories.length; i++) {
			preOut.push({seriesName: categories[i], data: [], color: 'blue'});
			this.state.times.forEach(slot => {
				if (slot.end != null && slot.classId === categories[i]) {
					const differenceHours = slot.start.getHours() - slot.end.getHours();
					// TODO: get the aggregate amount of time spent and push that
					preOut[i].data.push({x: this.getDayString(slot.start.getDay()), y: differenceHours});
				}
			});
		}

		// now go through each element and add the rest of the week
		/*for (let e = 0; e < preOut.length; e++) {
			if (preOut[e].data.length < 7) {
				for (let f = preOut[e].data.length; f < 7; f++) {
					preOut[e].data.push({x: this.getDayString(f - 1), y: 0});
				}
			}
		}*/

		console.log(preOut);

		this.setState({data: preOut});
	}

	componentWillMount() {
		timeslot.subscribe(timeslots => {
			this.setState({times: timeslots});
			this.refreshData();
		});
	}

	render() {
		console.log(`RENDER: ${this.state.data}`);
		if (this.state.data.length !== 0) {
			console.log(`RENDER: ${this.state.data}`);
			return (
				<SafeAreaView style={styles.safeArea}>
					<Hamburger toggle={this.props.navigation.toggleDrawer} />
					<View style={styles.container}>
					<PureChart
						type='bar'
						data={this.state.data}
						width={1200}
						height={400}
						showEvenNumberXaxisLabel={false}
					/>
					</View>
				</SafeAreaView>
			);
		} else {
			return null;
		}
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

const mockData = [
	{
		seriesName: 'chem-512',
		data: [
			{x: 'monday', y: 20},
			{x: 'tuesday', y: 50},
			{x: 'wednesday', y: 70}
		],
		color: StyleGuide.PRIMARY[100]
	},
	{
		seriesName: 'history',
		data: [
			{x: 'monday', y: 60},
			{x: 'tuesday', y: 50},
			{x: 'wednesday', y: 0}
		],
		color: StyleGuide.PRIMARY[300]
	},
	{
		seriesName: 'thething',
		data: [
			{x: 'monday', y: 60},
			{x: 'tuesday', y: 50},
			{x: 'wednesday', y: 70}
		],
		color: StyleGuide.PRIMARY[500]
	}
];
