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

interface AnalyticsState {
	times: any[];
	classes: string[];
	weeklyTimes: any[];
	weeklyTotal: number;
	dailyTimes: any[];
	dailyTotal: number;
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
			weeklyTimes: [],
			weeklyTotal: 0,
			dailyTimes: [],
			dailyTotal: 0
		};
	}

	compareDate(date1: Date, date2: Date) {
		return (date1.getDate() === date2.getDate());
	}

	private getWeeklyData() {
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

	private getDailyTimes() {
			// gets the daily reference point
			const today: Date = new Date();

			const out: any[] = []; // weekly timeslots
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
	}

	private beautifyMinutes(num: number) {
		return (`${Math.round(num)}h ${(num * 60).toFixed(2)}m`);
	}

	componentWillMount() {
		timeslot.subscribe(timeslots => {
			this.setState({times: timeslots});
			this.getWeeklyData();
			this.getDailyTimes();
		});
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.verticalContainer}>
				<Text style={styles.headerTitle}>This Week</Text>
				<PureChart
					type='bar'
					data={mockData}
					width={1200}
					height={400}
					showEvenNumberXaxisLabel={false}
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
