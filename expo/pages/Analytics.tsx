import bind from 'bind-decorator';
import * as React from 'react';
import moment from 'moment';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import PureChart from 'react-native-pure-chart';
import Swiper from 'react-native-swiper';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { PRIMARY } from '../common/StyleGuide';
import { Timeslot } from '../common/Timeslot';
import { getUserTimeslots } from '../common/User';
import Hamburger from '../components/Hamburger';

interface PieChartDataPoint {
	label: string;
	value: number;
	color: string;
}

interface LineChartDataPoint {
	seriesName: string;
	data: any[];
	color: string;
}

interface AnalyticsState {
	times: Timeslot[];
	classes: string[];
	weeklyTimes: Timeslot[];
	weeklyTotal: number;
	dailyTimes: Timeslot[];
	dailyTotal: number;
	pieChartData: PieChartDataPoint[];
	lineChartData: LineChartDataPoint[];
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
			pieChartData: [
				{
					value: 50,
					label: 'No Work!',
					color: 'red'
				}
			],
			weeklyTimes: [],
			weeklyTotal: 0,
			dailyTimes: [],
			dailyTotal: 0,
			lineChartData: []
		};
	}

	compareDate(date1: Date, date2: Date) {
		return date1.getDate() === date2.getDate();
	}

	private calcHourDiff(start: Date, end: Date): number {
		return moment.duration(moment(end).diff(start)).as('hours');
	}

	private calcMinuteDiff(start: Date, end: Date): number {
		return moment.duration(moment(end).diff(start)).as('minutes');
	}

	private pickRandomColor() {
		const colors: string[] = Object.values(PRIMARY);
		return colors[Math.floor(Math.random() * colors.length)];
	}

	private convertDay(day: number) {
		switch (day) {
			case 0: return 'Sunday';
			case 1: return 'Monday';
			case 2: return 'Tuesday';
			case 3: return 'Wednesday';
			case 4 :return 'Thursday';
			case 5: return 'Friday';
			case 6: return 'Saturday';
			default: return 'Day'
		}
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

		// need to get available days of the week
		/*let availableDates: number[] = [];
		weeklyTimes.forEach(time => {
			if (availableDates.indexOf(time.start.getDay()) === -1) {
				// new day found, push it
				availableDates.push(time.start.getDay());
			}
		})*/

		// now that we have the available days of the week, we need to create the chartData
		// we need one series that has each day
		let chartData: LineChartDataPoint[] = [];

		let thisWeekData: LineChartDataPoint = {
			seriesName: 'Series',
			data: [],
			color: this.pickRandomColor()
		}

		for (let i = 0; i < 7; i++) {
			// i is day of the week
			let dayTotal = 0;

			weeklyTimes.forEach(time => {
				if (time.end !== null && time.start.getDay() === i) {
					dayTotal += this.calcHourDiff(time.start, time.end);
				}
			})
			thisWeekData.data.push({x: this.convertDay(i), y: (dayTotal > 0)? parseFloat(dayTotal.toFixed(2)): dayTotal});
		}

		chartData.push(thisWeekData);

		let total = 0;

		for (const time of weeklyTimes) {
			if (time.end != null) {
				total += this.calcHourDiff(time.start, time.end);
			}
		}

		total /= weeklyTimes.length; // get an average

		this.setState({ weeklyTimes, weeklyTotal: total, lineChartData: chartData });
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
				total += this.calcHourDiff(time.start, time.end);
			}
		}

		this.setState({ dailyTotal: total, dailyTimes });

		// now find the classes
		const classes: string[] = [];
		for (const slot of dailyTimes) {
			if (slot.end !== null && !classes.includes(slot.classId)) {
				// new class found, push it
				classes.push(slot.classId);
			}
		}

		console.log(classes);

		this.setState({ classes });

		const chartData: PieChartDataPoint[] = [];
		// create the chartData for the day
		for (const cl of classes) {
			console.log(cl);
			let totalHours = 0;
			for (const slot of dailyTimes) {
				if (slot.end != null && slot.classId === cl) {
					const diff = Math.round(this.calcHourDiff(slot.start, slot.end));
					console.log(`hour diff: ${diff}`);
					totalHours += (diff === 0)? this.calcMinuteDiff(slot.start, slot.end): diff;
				}
			}

			chartData.push({
				label: cl,
				value: +(totalHours).toFixed(2),
				color: this.pickRandomColor()
			});
		}

		console.log(chartData);

		if (chartData.length > 0) {
			this.setState({ pieChartData: chartData });
		}
	}

	private findMostPracticedSubject(): string {
		if (this.state.dailyTimes.length > 0) {
			let biggestClass = 0;

			for (let i = 0; i < this.state.dailyTimes.length; i++) {
				if (this.state.dailyTimes[i].end !== null && this.calcHourDiff(this.state.dailyTimes[i].start, this.state.dailyTimes[i].end) > this.calcHourDiff(this.state.dailyTimes[biggestClass].start, this.state.dailyTimes[biggestClass].end)) {
					// new class found, update index
					biggestClass = i;
				}
			}

			return this.state.dailyTimes[biggestClass].classId;
		} else {
			return 'Not Available';
		}
	}

	private findLeastPracticedSubject(): string {
		if (this.state.dailyTimes.length > 0) {
			let smallestClass = 0;

			for (let i = 0; i < this.state.dailyTimes.length; i++) {
				if (this.state.dailyTimes[i].end !== null && this.calcHourDiff(this.state.dailyTimes[i].start, this.state.dailyTimes[i].end) < this.calcHourDiff(this.state.dailyTimes[smallestClass].start, this.state.dailyTimes[smallestClass].end)) {
					// new class found, update index
					smallestClass = i;
				}
			}

			return this.state.dailyTimes[smallestClass].classId;
		} else {
			return 'Not Available';
		}
	}

	private findDayDeviation() {
		let tempTotal = 0;
		const average = this.state.weeklyTotal / this.state.weeklyTimes.length;
		for (const val of this.state.dailyTimes) {
			if (val.end !== null)
				tempTotal += Math.pow(this.calcHourDiff(val.start, val.end) - average, 2);
		}
		return (Math.sqrt(tempTotal / (this.state.dailyTimes.length - 1))).toFixed(2);
	}

	private beautifyMinutes(num: number) {
		// TODO: get the beautify minutes working
		return `${Math.round(num)}H`;
	}

	componentWillMount() {
		getUserTimeslots().then(timeslots => {
			this.setState({ times: timeslots });
			console.log(timeslots);
			this.makeWeeklyData();
			this.makeDailyData();
		});
		//this.updateData();
	}

	@bind
	private updateData() {
		// showEvenNumberXaxisLabel={false}
		getUserTimeslots().then(timeslots => {
			this.setState({ times: timeslots });
			console.log(timeslots);
			this.makeWeeklyData();
			this.makeDailyData();
		});
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.verticalContainer}>
				<Swiper horizontal={false}>
				<View style={styles.verticalContainer}>
					<Text style={styles.headerTitle}>Today (in hours)</Text>
					<PureChart
						type='pie'
						data={this.state.pieChartData}
						width={'100%'}
						height={400}
					/>
					<View style={styles.horizontalContainer}>
						<View style={styles.verticalContainer}>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Today's Total</Text>
								<Text style={styles.text}>{this.beautifyMinutes(this.state.dailyTotal)}</Text>
							</View>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Today's Deviation</Text>
								<Text style={styles.text}>{`${this.findDayDeviation()}H`}</Text>
							</View>
						</View>
						<View style={styles.verticalContainer}>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Most Active</Text>
								<Text style={styles.text}>{this.findMostPracticedSubject()}</Text>
							</View>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Least Active</Text>
								<Text style={styles.text}>{this.findLeastPracticedSubject()}</Text>
							</View>
						</View>
					</View>
				</View>
				<View style={styles.verticalContainer}>
					<Text style={styles.headerTitle}>This week (in hours)</Text>
					<PureChart
						type='bar'
						data={this.state.lineChartData}
						width={'100%'}
						height={200}
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
				</Swiper>
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
		backgroundColor: PRIMARY[700]
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
