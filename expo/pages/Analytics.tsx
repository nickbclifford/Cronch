import bind from 'bind-decorator';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PureChart from 'react-native-pure-chart';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { from } from 'rxjs';
import * as StyleGuide from '../common/StyleGuide';
import { Timeslot } from '../common/Timeslot';
import { getUserTimeslots } from '../common/User';

const timeslot = from(getUserTimeslots());

import Hamburger from '../components/Hamburger';
import { updateLocale } from 'moment';
import { Button } from 'react-native-elements';

interface AnalyticsState {
	times: any[];
	classes: string[];
	weeklyTimes: any[];
	weeklyTotal: number;
	dailyTimes: any[];
	dailyTotal: number;
	chartData: any[];
}

export default class Template extends React.Component<NavigationScreenProps, AnalyticsState> {

	static navigationOptions = {
		header: null
	};

	constructor(props: any) {
		super(props);
		this.state = {
			times: [],
			classes: [],
			chartData: [
				{
					value: 50,
					label: 'stuff',
					color: 'red'
				},
				{
					value: 29,
					label: 'otherstuff',
					color: 'blue'
				}
			],
			weeklyTimes: [],
			weeklyTotal: 0,
			dailyTimes: [],
			dailyTotal: 0
		};
	}

	compareDate(date1: Date, date2: Date) {
		return (date1.getDate() === date2.getDate());
	}

	private calculateHourDiff(start: Date, end: Date): number {
		return ((end.getTime() - start.getTime()) * (1 / (1000 * 60 * 60)));
	}

	private pickRandomColor() {
		return colors[Math.floor(Math.random() * colors.length)];
	}

	private makeWeeklyData() {
		// gets the weekly reference point
		const thisWeek: Date = new Date();
		thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());

		const out: any[] = []; // weekly timeslots
		this.state.times.forEach(time => {
			if (time.end != null && time.start > thisWeek) {
				out.push(time);
			}
		});

		let ttl = 0;

		out.forEach(time => {
			ttl += ((time.end.getTime() - time.start.getTime()) * (1 / (1000 * 60 * 60)));
		});

		ttl /= out.length; // get an average

		this.setState({weeklyTimes: out});
		this.setState({weeklyTotal: ttl});
	}

	private makeDailyData() {
			// gets the daily reference point
			const today: Date = new Date();

			const out: any[] = []; // daily timeslots
			this.state.times.forEach(time => {
				if (time.end != null && time.start.getDay() === today.getDay()) {
					out.push(time);
				}
			});

			let ttl = 0;

			out.forEach(time => {
				ttl += ((time.end.getTime() - time.start.getTime()) * (1 / (1000 * 60 * 60)));
			});

			this.setState({dailyTotal: ttl});
			this.setState({dailyTimes: out});

			// now find the classes
			const cs: string[] = [];
			out.forEach(slot => {
				if (slot.classId !== null && cs.indexOf(slot.classId) === -1) {
					// new class found, push it
					cs.push(slot.classId);
				}
			});

			console.log(cs);

			this.setState({classes: cs});

			const preOut: any[] = [];
			// create the chartData for the day
			cs.forEach(cl => {
				console.log(cl);
				let totalHours = 0;
				out.forEach(slot => {
					if (slot.end != null && slot.classId === cl) {
						totalHours += this.calculateHourDiff(slot.start, slot.end);
					}
				});

				preOut.push({label: cl, value: +(totalHours * 60).toFixed(2), color: this.pickRandomColor()});
			});

			console.log(preOut);
			this.setState({chartData: preOut});
	}

	private beautifyMinutes(num: number) {
		return (`${Math.round(num)}h ${(num * 60).toFixed(2)}m`);
	}

	componentWillMount() {
		timeslot.subscribe(timeslots => {
			this.setState({times: timeslots});
			this.makeWeeklyData();
			this.makeDailyData();
		});
	}

	@bind
	private updateData() {
		// showEvenNumberXaxisLabel={false}
		this.makeWeeklyData();
		this.makeDailyData();
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.verticalContainer}>
				<Text style={styles.headerTitle}>This Week</Text>
				<PureChart
					type='pie'
					data={this.state.chartData}
					width={1200}
					height={400}
				/>
				<View style={styles.horizontalContainer}>
					<View style={styles.verticalContainer}>
						<View style={styles.verticalContainer}>
							<Text style={styles.title}>Weekly Average</Text>
							<Text style={styles.text}>{this.beautifyMinutes(this.state.weeklyTotal)}</Text>
						</View>
						<View style={styles.verticalContainer}>
							<Text style={styles.title}>Today's Total</Text>
							<Text style={styles.text}>{this.beautifyMinutes(this.state.dailyTotal)}</Text>
						</View>
					</View>
					<View style={styles.verticalContainer}>
						<View style={styles.verticalContainer}>
							<Text style={styles.title}>Heaviest Night</Text>
							<Text style={styles.text}>Coming Soon!</Text>
						</View>
						<View style={styles.verticalContainer}>
							<Text style={styles.title}>Lightest Night</Text>
							<Text style={styles.text}>Coming Soon!</Text>
						</View>
					</View>
				</View>
				<Button title='Update' onPress={this.updateData} style={StyleGuide.components.buttonStyle} />
				</View>
			</SafeAreaView>
		);
	}

}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%'
	},
	headerTitle: {
		color: StyleGuide.PRIMARY[700],
		fontSize: 25,
		fontFamily: 'Nunito-Regular'
	},
	title: {
		color: StyleGuide.PRIMARY[900],
		fontSize: 20,
		fontFamily: 'Nunito-Regular'
	},
	text: {
		color: StyleGuide.PRIMARY[700],
		fontSize: 15,
		fontFamily: 'Nunito-Regular'
	},
	verticalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column'
	},
	horizontalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	}
});

const mockData = [
	{
		seriesName: 'chem-512',
		data: [
			{x: 'monday', y: 20},
			{x: 'tuesday', y: 50},
			{x: 'wednesday', y: 70},
			{x: 'thursday', y: 20},
			{x: 'friday', y: 40},
			{x: 'saturday', y: 80},
			{x: 'sunday', y: 90}
		],
		color: StyleGuide.PRIMARY[100]
	},
	{
		seriesName: 'history',
		data: [
			{x: 'monday', y: 20},
			{x: 'tuesday', y: 50},
			{x: 'wednesday', y: 70},
			{x: 'thursday', y: 10},
			{x: 'friday', y: 80},
			{x: 'saturday', y: 20},
			{x: 'sunday', y: 90}
		],
		color: StyleGuide.PRIMARY[300]
	},
	{
		seriesName: 'thething',
		data: [
			{x: 'monday', y: 10},
			{x: 'tuesday', y: 34},
			{x: 'wednesday', y: 91},
			{x: 'thursday', y: 23},
			{x: 'friday', y: 56},
			{x: 'saturday', y: 12},
			{x: 'sunday', y: 67}
		],
		color: StyleGuide.PRIMARY[500]
	}
];

const pieMock = [
	{
		value: 0.5,
		label: 'stuff',
		color: 'red'
	},
	{
		value: 0.2,
		label: 'otherstuff',
		color: 'blue'
	}
];

const colors = [
	'#F9EBFF',
	'#E6AFFB',
	'#CC76EE',
	'#7C16A5',
	'#540174'
];
