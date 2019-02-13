import bind from 'bind-decorator';
import { Button } from 'react-native-elements';
import { Dimensions } from 'react-native';
import Hamburger from '../components/Hamburger';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import PureChart from 'react-native-pure-chart';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { components, PRIMARY } from '../common/StyleGuide';
import { Timeslot } from '../common/Timeslot';
import { getUserTimeslots } from '../common/User';
import Hamburger from '../components/Hamburger';

interface ChartDataPoint {
	label: string;
	value: number;
	color: string;
}

interface AnalyticsState {
	times: Timeslot[];
	classes: string[];
	weeklyTimes: Timeslot[];
	weeklyTotal: number;
	dailyTimes: Timeslot[];
	dailyTotal: number;
	chartData: ChartDataPoint[];
}

export default class Analytics extends React.Component<NavigationScreenProps, AnalyticsState> {

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
		return date1.getDate() === date2.getDate();
	}

	private calculateHourDiff(start: Date, end: Date): number {
		return (end.getTime() - start.getTime()) * (1 / (1000 * 60 * 60));
	}

	private pickRandomColor() {
		const colors: string[] = Object.values(PRIMARY);
		return colors[Math.floor(Math.random() * colors.length)];
	}

	private makeWeeklyData() {
		// gets the weekly reference point
		const thisWeek = new Date();
		thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());

		const weeklyTimes: Timeslot[] = []; // weekly timeslots
		for (const time of this.state.times) {
			if (time.end != null && time.start > thisWeek) {
				weeklyTimes.push(time);
			}
		}

		let total = 0;

		for (const time of weeklyTimes) {
			if (time.end != null) {
				total += (time.end.getTime() - time.start.getTime()) * (1 / (1000 * 60 * 60));
			}
		}

		total /= weeklyTimes.length; // get an average

		this.setState({ weeklyTimes, weeklyTotal: total });
	}

	private makeDailyData() {
		// gets the daily reference point
		const today = new Date();

		const dailyTimes: Timeslot[] = []; // daily timeslots
		for (const time of this.state.times) {
			if (time.end != null && time.start.getDay() === today.getDay()) {
				dailyTimes.push(time);
			}
		}

		let total = 0;

		for (const time of dailyTimes) {
			if (time.end != null) {
				total += (time.end.getTime() - time.start.getTime()) * (1 / (1000 * 60 * 60));
			}
		}

		this.setState({ dailyTotal: total, dailyTimes });

		// now find the classes
		const classes: string[] = [];
		for (const slot of dailyTimes) {
			if (!classes.includes(slot.classId)) {
				// new class found, push it
				classes.push(slot.classId);
			}
		}

		console.log(classes);

		this.setState({ classes });

		const chartData: ChartDataPoint[] = [];
		// create the chartData for the day
		for (const cl of classes) {
			console.log(cl);
			let totalHours = 0;
			for (const slot of dailyTimes) {
				if (slot.end != null && slot.classId === cl) {
					totalHours += this.calculateHourDiff(slot.start, slot.end);
				}
			}

			chartData.push({
				label: cl,
				value: +(totalHours * 60).toFixed(2),
				color: this.pickRandomColor()
			});
		}

		console.log(chartData);
		this.setState({ chartData });
	}

	private beautifyMinutes(num: number) {
		return `${Math.round(num)}h ${(num * 60).toFixed(2)}m`;
	}

	componentWillMount() {
		getUserTimeslots().then(timeslots => {
			this.setState({ times: timeslots });
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
				<Swiper horizontal={true}>
				<View style={styles.verticalContainer}>
					<Text style={styles.headerTitle}>Today (in minutes)</Text>
					<PureChart
						type='pie'
						data={this.state.chartData}
						width={'100%'}
						height={400}
					/>
				</View>
				<View style={styles.verticalContainer}>
					<Text style={styles.headerTitle}>This week (in minutes)</Text>
					<PureChart
						type='bar'
						data={mockData}
						width={'100%'}
						height={200}
						showEvenNumberXaxisLabel={false}
					/>
				</View>
				</Swiper>
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
				<Button title='Update' onPress={this.updateData} style={styles.buttonStyle} />
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
		color: PRIMARY[700],
		fontSize: 25,
		fontFamily: 'Nunito-Regular'
	},
	title: {
		color: PRIMARY[900],
		fontSize: 20,
		fontFamily: 'Nunito-Regular'
	},
	text: {
		color: PRIMARY[700],
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
	},
	buttonStyle: {
		paddingTop: 12,
		paddingRight: 24,
		paddingLeft: 24,
		paddingBottom: 12,
		backgroundColor: StyleGuide.PRIMARY[700]
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
		color: PRIMARY[100]
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
		color: PRIMARY[300]
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
		color: PRIMARY[500]
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
