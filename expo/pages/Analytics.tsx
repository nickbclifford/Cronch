import bind from 'bind-decorator';
import moment from 'moment';
import * as React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Platform } from 'react-native';
import { Button } from 'react-native-elements';
import PureChart from 'react-native-pure-chart';
import Swiper from 'react-native-swiper';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { Subscription } from 'rxjs';
import Sentry from 'sentry-expo';
import stats from 'stats-lite';

import withAssignmentContext, { WithAssignmentContextProps } from '../common/AssignmentContext';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import { ColorPalette, components } from '../common/StyleGuide';
import { defaultColor, defaultTextDark } from '../common/Task';
import { Timeslot } from '../common/Timeslot';
import { getUserTimeslots } from '../common/User';

enum ViewMode {
	DAILY, WEEKLY, MONTHLY
}

export const PRIMARY = [
	'#E6AFFB',
	'#CC76EE',
	'#7C16A5',
	'#540174'
];

interface PieChartDataPoint {
	label: string;
	value: number;
	color: string;
}

interface BarChartDataPoint {
	seriesName: string;
	data: Array<{
		x: string,
		y: number
	}>;
	color: string;
}

interface AnalyticsState {
	times: Timeslot[];
	canvasClasses: CanvasEvent[];
	dailyClasses: string[];
	weeklyTimes: Timeslot[];
	weeklyTotal: number;
	dailyTimes: Timeslot[];
	dailyTotal: number;
	monthlyTimes: Timeslot[];
	dailyView: boolean;
	dailyChartData: PieChartDataPoint[];
	weeklyChartData: BarChartDataPoint[];
	monthlyChartData: BarChartDataPoint[];
}

class Analytics extends React.Component<NavigationScreenProps & WithAssignmentContextProps, AnalyticsState> {

	static navigationOptions = createNavigationOptions('Analytics');

	canvasEventsSubscription?: Subscription;

	constructor(props: any) {
		super(props);
		this.state = {
			times: [],
			canvasClasses: [],
			dailyClasses: [],
			dailyChartData: [
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
			weeklyChartData: [],
			dailyView: true,
			monthlyChartData: [],
			monthlyTimes: []
		};
	}

	compareDate(date1: Date, date2: Date) {
		return date1.getDate() === date2.getDate();
	}

	private calcHourDiff(start: Date, end: Date): number {
		return moment.duration(moment(end).diff(start)).as('hours');
	}

	private pickRandomColor() {
		// const colors: string[] = Object.values(PRIMARY);
		return PRIMARY[Math.floor(Math.random() * PRIMARY.length)];
	}

	private convertDay(day: number) {
		switch (day) {
			case 0: return 'Sunday';
			case 1: return 'Monday';
			case 2: return 'Tuesday';
			case 3: return 'Wednesday';
			case 4 : return 'Thursday';
			case 5: return 'Friday';
			case 6: return 'Saturday';
			default: return 'Day';
		}
	}

	private makeWeeklyData() {
		// gets the weekly reference point
		const thisWeek = new Date();
		thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());

		const weeklyTimes: Timeslot[] = []; // weekly timeslots
		for (const time of this.state.times) {
			if (time.end !== null && time.start > thisWeek) {
				weeklyTimes.push(time);
			}
		}

		// now that we have the available days of the week, we need to create the chartData
		// we need one series that has each day
		const chartData: BarChartDataPoint[] = [];

		const thisWeekData: BarChartDataPoint = {
			seriesName: 'Series',
			data: [],
			color: this.pickRandomColor()
		};

		for (let i = 0; i < 7; i++) {
			// i is day of the week
			let dayTotal = 0;

			weeklyTimes.forEach(time => {
				if (time.end !== null && time.start.getDay() === i) {
					dayTotal += this.calcHourDiff(time.start, time.end);
				}
			});
			thisWeekData.data.push({x: this.convertDay(i), y: (dayTotal > 0) ? parseFloat(dayTotal.toFixed(2)) : dayTotal});
		}

		chartData.push(thisWeekData);

		let total = 0;

		for (const time of weeklyTimes) {
			if (time.end !== null) {
				total += this.calcHourDiff(time.start, time.end);
			}
		}

		total /= weeklyTimes.length; // get an average

		this.setState({ weeklyTimes, weeklyTotal: total, weeklyChartData: chartData });
	}

	private makeDailyData() {
		// gets the daily reference point
		const today = new Date();

		const dailyTimes: Timeslot[] = []; // daily timeslots
		for (const time of this.state.times) {
			if (time.end !== null && time.start.getDay() === today.getDay()) {
				dailyTimes.push(time);
			}
		}

		let total = 0;

		for (const time of dailyTimes) {
			if (time.end !== null) {
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

		this.setState({ dailyClasses: classes });

		const chartData: PieChartDataPoint[] = [];
		// create the chartData for the day
		for (const cl of classes) {
			let totalHours = 0;
			for (const slot of dailyTimes) {
				if (slot.end && slot.classId === cl) {
					// totalHours += (diff === 0) ? this.calcHourDiff(slot.start, slot.end) : diff;
					totalHours += this.calcHourDiff(slot.start, slot.end);
				}
			}

			// color: fromCanvas ? color : this.pickRandomColor()

			if (totalHours > 0.01) {
				// only push if there's sufficient data
				const { name, color, fromCanvas } = this.getClassNameAndColor(cl);
				chartData.push({
					label: name,
					value: parseFloat((totalHours).toFixed(2)),
					color: this.pickRandomColor()
				});
			}
		}

		if (chartData.length > 0) {
			this.setState({ dailyChartData: chartData });
		}
	}

	private makeMonthlyData() {
		// gets the month reference point
		const thisMonth = new Date();
		thisMonth.setDate(1);

		const monthlyTimes: Timeslot[] = []; // this month's timeslots
		for (const time of this.state.times) {
			if (time.end !== null && time.start > thisMonth) {
				monthlyTimes.push(time);
			}
		}

		// now that we have the available days of the week, we need to create the chartData
		// we need one series that has each day
		const chartData: BarChartDataPoint[] = [];

		const thisMonthData: BarChartDataPoint = {
			seriesName: 'Series',
			data: [],
			color: this.pickRandomColor()
		};

		for (let i = 1; i <= 31; i++) {
			// i is day of the month
			let dayTotal = 0;

			monthlyTimes.forEach(time => {
				if (time.end !== null && time.start.getDate() === i) {
					dayTotal += this.calcHourDiff(time.start, time.end);
				}
			});
			thisMonthData.data.push({
				x: `${thisMonth.getMonth()}/${i.toString()}`,
				y: (dayTotal > 0) ? parseFloat(dayTotal.toFixed(2)) : dayTotal
			});
		}

		chartData.push(thisMonthData);

		this.setState({ monthlyTimes, monthlyChartData: chartData });
	}

	private findMostPracticedSubject(): string {
		if (this.state.weeklyTimes.length > 0) {
			let biggestClass = 0;

			for (let i = 0; i < this.state.weeklyTimes.length; i++) {
				if (this.state.weeklyTimes[i].end !== null &&
					this.calcHourDiff(this.state.weeklyTimes[i].start, this.state.weeklyTimes[i].end!) >
					this.calcHourDiff(this.state.weeklyTimes[biggestClass].start, this.state.weeklyTimes[biggestClass].end!)) {
					// new class found, update index
					biggestClass = i;
				}
			}

			const biggestId = this.state.weeklyTimes[biggestClass].classId;
			const { name } = this.getClassNameAndColor(biggestId);
			return name;
		} else {
			return 'Not Available';
		}
	}

	private findMonthlyMostPracticedSubject(): string {
		if (this.state.monthlyTimes.length > 0) {
			let biggestClass = 0;

			for (let i = 0; i < this.state.monthlyTimes.length; i++) {
				if (this.state.monthlyTimes[i].end !== null &&
					this.calcHourDiff(this.state.monthlyTimes[i].start, this.state.monthlyTimes[i].end!) >
					this.calcHourDiff(this.state.monthlyTimes[biggestClass].start, this.state.monthlyTimes[biggestClass].end!)) {
					// new class found, update index
					biggestClass = i;
				}
			}

			const biggestId = this.state.monthlyTimes[biggestClass].classId;
			const { name } = this.getClassNameAndColor(biggestId);
			return name;
		} else {
			return 'Not Available';
		}
	}

	private findWeeklyHeaviestNight(): string {
		if (this.state.weeklyTimes.length > 0) {
			let biggestClass = 0;

			for (let i = 0; i < this.state.weeklyTimes.length; i++) {
				if (this.state.weeklyTimes[i].end !== null &&
					this.calcHourDiff(this.state.weeklyTimes[i].start, this.state.weeklyTimes[i].end!) >
					this.calcHourDiff(this.state.weeklyTimes[biggestClass].start, this.state.weeklyTimes[biggestClass].end!)) {
					// new class found, update index
					biggestClass = i;
				}
			}

			return this.convertDay(this.state.weeklyTimes[biggestClass].start.getDay());
		} else {
			return 'Not Available';
		}
	}

	private findMonthlyHeaviestNight(): string {
		if (this.state.monthlyTimes.length > 0) {
			let biggestClass = 0;

			for (let i = 0; i < this.state.monthlyTimes.length; i++) {
				if (this.state.monthlyTimes[i].end !== null &&
					this.calcHourDiff(this.state.monthlyTimes[i].start, this.state.monthlyTimes[i].end!) >
					this.calcHourDiff(this.state.monthlyTimes[biggestClass].start, this.state.monthlyTimes[biggestClass].end!)) {
					// new class found, update index
					biggestClass = i;
				}
			}

			return this.state.monthlyTimes[biggestClass].start.getDate().toString();
		} else {
			return 'Not Available';
		}
	}

	private findMonthDeviation(): number {
		const monthlyRaw: number[] = [];
		this.state.monthlyTimes.forEach((day: Timeslot) => {
			if (day.end && this.calcHourDiff(day.start, day.end) > 0) {
				monthlyRaw.push(this.calcHourDiff(day.start, day.end));
			}
		});

		return stats.stdev(monthlyRaw);

		/*
		let tempTotal = 0;
		// find monthly total
		let total = 0;
		this.state.monthlyTimes.forEach((day) => {
			if (day.end) {
				total += this.calcHourDiff(day.start, day.end);
			}
		})

		const average = this.state.weeklyTotal / this.state.weeklyTimes.length;
		for (const val of this.state.weeklyTimes) {
			if (val.end !== null) {
				tempTotal += Math.pow(this.calcHourDiff(val.start, val.end) - average, 2);
			}
		}

		const deviation = (Math.sqrt(tempTotal / (this.state.weeklyTimes.length - 1)));
		if (isNaN(deviation)) {
			return 0;
		} else {
			return parseFloat(deviation.toFixed(2));
		}*/
	}

	private findWeeklyDeviation(): number {
		let tempTotal = 0;
		const average = this.state.weeklyTotal / this.state.weeklyTimes.length;
		for (const val of this.state.weeklyTimes) {
			if (val.end !== null) {
				tempTotal += Math.pow(this.calcHourDiff(val.start, val.end) - average, 2);
			}
		}

		const deviation = (Math.sqrt(tempTotal / (this.state.weeklyTimes.length - 1)));
		if (isNaN(deviation)) {
			return 0;
		} else {
			return parseFloat(deviation.toFixed(2));
		}
	}

	private findDayDeviation(): number {
		let tempTotal = 0;
		const average = this.state.dailyTotal / this.state.dailyTimes.length;
		for (const val of this.state.dailyTimes) {
			if (val.end !== null) {
				tempTotal += Math.pow(this.calcHourDiff(val.start, val.end) - average, 2);
			}
		}

		const deviation = (Math.sqrt(tempTotal / (this.state.dailyTimes.length)));
		if (isNaN(deviation)) {
			return 0;
		} else {
			return parseFloat(deviation.toFixed(2));
		}
	}

	private findMonthlyAverage(): number {
		const monthlyRaw: number[] = [];
		this.state.monthlyTimes.forEach((day: Timeslot) => {
			if (day.end && this.calcHourDiff(day.start, day.end) > 0) {
				monthlyRaw.push(this.calcHourDiff(day.start, day.end));
			}
		});

		return stats.mean(monthlyRaw);

		/*
		// find monthly total
		let total = 0;
		this.state.monthlyTimes.forEach((day: Timeslot) => {
			if (day.end) {
				total += this.calcHourDiff(day.start, day.end);
			}
		})

		const average = total / this.state.monthlyTimes.length;

		if (isNaN(average)) {
			return 0;
		} else {
			return parseFloat(average.toFixed(2));
		}
		*/
	}

	private getClassNameAndColor(id: string) {
		const canvasClass = this.state.canvasClasses.find(a => a._id === id);

		if (canvasClass) {
			return {
				fromCanvas: true,
				name: canvasClass.class.name,
				color: canvasClass.class.color,
				textDark: canvasClass.class.textDark
			};
		} else {
			return {
				fromCanvas: false,
				name: id,
				color: defaultColor,
				textDark: defaultTextDark
			};
		}
	}

	/**
	 * Makes time more human readable
	 * @param num number in hours that is fixed at 2 demicalpoints
	 */
	private beautifyTime(num: number) {
		// split time by decimal
		const dec = num.toString().split('.');
		if (dec[1]) {
			return `${Math.round(num)}h ${Math.round(num * 60)}m`;
		} else {
			return `${Math.round(num)}h`;
		}
	}

	componentWillMount() {
		this.canvasEventsSubscription = MyMICDS.canvas.getEvents().subscribe(
			events => {
				if (events.hasURL && events.events) {
					this.setState({ canvasClasses: events.events });
					this.updateData();
				}
			},
			err => Sentry.captureException(err)
		);
	}

	componentDidMount() {
		this.updateData();
	}

	componentWillUnmount() {
		if (this.canvasEventsSubscription) {
			this.canvasEventsSubscription.unsubscribe();
		}
	}

	@bind
	private updateData() {
		getUserTimeslots().then(timeslots => {
			this.setState({ times: timeslots });
			this.makeWeeklyData();
			this.makeDailyData();
			this.makeMonthlyData();
		}).catch(err => Sentry.captureException(err));
	}

	@bind
	private swapView() {
		this.setState(prev => ({ dailyView: !prev.dailyView }));
	}

	render() {
		if (Platform.OS === 'android') {
			if (this.state.dailyView) {
				// daily view
				return;
			} else {
				// weekly view
				return;
			}
		} else {
			return (
				<SafeAreaView style={styles.safeArea}>
					<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
					<View style={styles.verticalContainer}>
					<Swiper horizontal={false}>
					<View style={styles.verticalContainer}>
						<Text style={styles.headerTitle}>This Month (in hours)</Text>
						<PureChart
							type='line'
							data={this.state.monthlyChartData}
							width={'100%'}
							height={200}
							showEvenNumberXaxisLabel={false}
						/>
						<View style={styles.horizontalContainer}>
						<View style={styles.verticalContainer}>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Monthly Average</Text>
								<Text style={styles.text}>{this.beautifyTime(this.findMonthlyAverage())}</Text>
							</View>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Monthly Deviation</Text>
								<Text style={styles.text}>{this.beautifyTime(this.findMonthDeviation())}</Text>
							</View>
						</View>
						<View style={styles.verticalContainer}>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Most Active</Text>
								<Text style={styles.text}>{this.findMonthlyMostPracticedSubject()}</Text>
							</View>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Heaviest Night</Text>
								<Text style={styles.text}>{this.findMonthlyHeaviestNight()}</Text>
							</View>
						</View>
						</View>
					</View>
					<View style={styles.verticalContainer}>
						<Text style={styles.headerTitle}>This Week (in hours)</Text>
						<PureChart
							type='bar'
							data={this.state.weeklyChartData}
							width={'100%'}
							height={200}
							showEvenNumberXaxisLabel={false}
						/>
						<View style={styles.horizontalContainer}>
						<View style={styles.verticalContainer}>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Weekly Average</Text>
								<Text style={styles.text}>{this.beautifyTime(this.state.weeklyTotal)}</Text>
							</View>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Weekly Deviation</Text>
								<Text style={styles.text}>{this.beautifyTime(this.findWeeklyDeviation())}</Text>
							</View>
						</View>
						<View style={styles.verticalContainer}>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Most Active</Text>
								<Text style={styles.text}>{this.findMostPracticedSubject()}</Text>
							</View>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Heaviest Night</Text>
								<Text style={styles.text}>{this.findWeeklyHeaviestNight()}</Text>
							</View>
						</View>
						</View>
					</View>
					<View style={styles.verticalContainer}>
						<Text style={styles.headerTitle}>Today (in hours)</Text>
						<PureChart
							type='pie'
							data={this.state.dailyChartData}
							width={'100%'}
							height={400}
						/>
						<View style={styles.horizontalContainer}>
							<View style={styles.verticalContainer}>
								<View style={styles.verticalContainer}>
									<Text style={styles.title}>Today's Total</Text>
									<Text style={styles.text}>{this.beautifyTime(this.state.dailyTotal)}</Text>
								</View>
								<View style={styles.verticalContainer}>
									<Text style={styles.title}>Today's Deviation</Text>
									<Text style={styles.text}>{this.beautifyTime(this.findDayDeviation())}</Text>
								</View>
							</View>
						</View>
					</View>
					</Swiper>
					<Button
						title='Update'
						onPress={this.updateData}
						containerStyle={styles.updateButton}
						buttonStyle={components.buttonStyle}
						titleStyle={components.buttonText}
					/>
					</View>
				</SafeAreaView>
			);
		}
	}

}

export default withAssignmentContext(Analytics);

const styles = StyleSheet.create({
	safeArea: {
		height: '100%'
	},
	headerTitle: {
		color: PRIMARY[700],
		fontSize: 25,
		fontFamily: 'Nunito-Regular',
		marginBottom: 15
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
	updateButton: {
		marginBottom: 16
	}
});

/*
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
];*/
