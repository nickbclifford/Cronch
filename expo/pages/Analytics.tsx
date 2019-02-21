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

import withAssignmentContext, { WithAssignmentContextProps } from '../common/AssignmentContext';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import { components, PRIMARY } from '../common/StyleGuide';
import { defaultColor, defaultTextDark } from '../common/Task';
import { Timeslot } from '../common/Timeslot';
import { getUserTimeslots } from '../common/User';

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
	classes: string[];
	weeklyTimes: Timeslot[];
	weeklyTotal: number;
	dailyTimes: Timeslot[];
	dailyTotal: number;
	monthlyTimes: Timeslot[];
	dailyView: boolean;
	pieChartData: PieChartDataPoint[];
	barChartData: BarChartDataPoint[];
	lineChartData: BarChartDataPoint[];
}

class Analytics extends React.Component<NavigationScreenProps & WithAssignmentContextProps, AnalyticsState> {

	static navigationOptions = createNavigationOptions('Analytics');

	canvasEventsSubscription?: Subscription;

	constructor(props: any) {
		super(props);
		this.state = {
			times: [],
			canvasClasses: [],
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
			barChartData: [],
			dailyView: true,
			lineChartData: [],
			monthlyTimes: []
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

		this.setState({ weeklyTimes, weeklyTotal: total, barChartData: chartData });
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

		this.setState({ classes });

		const chartData: PieChartDataPoint[] = [];
		// create the chartData for the day
		for (const cl of classes) {
			let totalHours = 0;
			for (const slot of dailyTimes) {
				if (slot.end !== null && slot.classId === cl) {
					const diff = Math.round(this.calcHourDiff(slot.start, slot.end));
					totalHours += (diff === 0) ? this.calcMinuteDiff(slot.start, slot.end) : diff;
				}
			}

			const { name, color, fromCanvas } = this.getClassNameAndColor(cl);

			chartData.push({
				label: name,
				value: +(totalHours).toFixed(2),
				color: fromCanvas ? color : this.pickRandomColor()
			});
		}

		if (chartData.length > 0) {
			this.setState({ pieChartData: chartData });
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

		for (let i = 0; i < 32; i++) {
			// i is day of the month
			let dayTotal = 0;

			monthlyTimes.forEach(time => {
				if (time.end !== null && time.start.getDate() === i) {
					dayTotal += this.calcHourDiff(time.start, time.end);
				}
			});
			thisMonthData.data.push({x: i.toString(), y: (dayTotal > 0) ? parseFloat(dayTotal.toFixed(2)) : dayTotal});
		}

		chartData.push(thisMonthData);

		this.setState({ monthlyTimes, lineChartData: chartData });
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

	private findHeaviestNight(): string {
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

	private findWeekDeviation() {
		let tempTotal = 0;
		const average = this.state.weeklyTotal / this.state.weeklyTimes.length;
		for (const val of this.state.weeklyTimes) {
			if (val.end !== null) {
				tempTotal += Math.pow(this.calcHourDiff(val.start, val.end) - average, 2);
			}
		}

		const deviation = (Math.sqrt(tempTotal / (this.state.weeklyTimes.length - 1)));
		if (isNaN(deviation)) {
			return 'None';
		} else {
			return deviation.toFixed(2) + 'h';
		}
	}

	private findDayDeviation() {
		let tempTotal = 0;
		const average = this.state.dailyTotal / this.state.dailyTimes.length;
		for (const val of this.state.dailyTimes) {
			if (val.end !== null) {
				tempTotal += Math.pow(this.calcHourDiff(val.start, val.end) - average, 2);
			}
		}

		const deviation = (Math.sqrt(tempTotal / (this.state.dailyTimes.length - 1)));
		if (isNaN(deviation)) {
			return 'None';
		} else {
			return deviation.toFixed(2) + 'h';
		}
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

	private beautifyMinutes(num: number) {
		// TODO: get the beautify minutes working
		return `${Math.round(num)}h`;
	}

	componentWillMount() {
		getUserTimeslots().then(timeslots => {
			this.setState({ times: timeslots });
			this.makeWeeklyData();
			this.makeDailyData();
		}).catch(err => Sentry.captureException(err));
		// this.updateData();

		this.canvasEventsSubscription = MyMICDS.canvas.getEvents().subscribe(
			events => {
				if (events.hasURL && events.events) {
					this.setState({ canvasClasses: events.events });
				}
			},
			err => Sentry.captureException(err)
		);
	}

	componentWillUnmount() {
		if (this.canvasEventsSubscription) {
			this.canvasEventsSubscription.unsubscribe();
		}
	}

	@bind
	private updateData() {
		// showEvenNumberXaxisLabel={false}
		getUserTimeslots().then(timeslots => {
			this.setState({ times: timeslots });
			this.makeWeeklyData();
			this.makeDailyData();
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
				return (
					<SafeAreaView style={styles.safeArea}>
						<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
						<View style={styles.verticalContainer}>
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
										<Text style={styles.text}>{this.findDayDeviation()}</Text>
									</View>
								</View>
							</View>
						</View>
						<Button
							title='Weekly'
							onPress={this.swapView}
							containerStyle={styles.updateButton}
							buttonStyle={components.buttonStyle}
							titleStyle={components.buttonText}
						/>
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
			} else {
				// weekly view
				return (
					<SafeAreaView style={styles.safeArea}>
						<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
						<View style={styles.verticalContainer}>
							<Text style={styles.headerTitle}>This week (in hours)</Text>
							<PureChart
								type='bar'
								data={this.state.barChartData}
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
									<Text style={styles.title}>Weekly Deviation</Text>
									<Text style={styles.text}>{this.findWeekDeviation()}</Text>
								</View>
							</View>
							<View style={styles.verticalContainer}>
								<View style={styles.verticalContainer}>
									<Text style={styles.title}>Most Active</Text>
									<Text style={styles.text}>{this.findMostPracticedSubject()}</Text>
								</View>
								<View style={styles.verticalContainer}>
									<Text style={styles.title}>Heaviest Night</Text>
									<Text style={styles.text}>{this.findHeaviestNight()}</Text>
								</View>
							</View>
						</View>
						<Button
							title='Daily'
							onPress={this.swapView}
							containerStyle={styles.updateButton}
							buttonStyle={components.buttonStyle}
							titleStyle={components.buttonText}
						/>
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

		} else {
			return (
				<SafeAreaView style={styles.safeArea}>
					<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
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
						</View>
					</View>
					<View style={styles.verticalContainer}>
						<Text style={styles.headerTitle}>This week (in hours)</Text>
						<PureChart
							type='bar'
							data={this.state.barChartData}
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
								<Text style={styles.title}>Weekly Deviation</Text>
								<Text style={styles.text}>{`${this.findWeekDeviation()}H`}</Text>
							</View>
						</View>
						<View style={styles.verticalContainer}>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Most Active</Text>
								<Text style={styles.text}>{this.findMostPracticedSubject()}</Text>
							</View>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Heaviest Night</Text>
								<Text style={styles.text}>{this.findHeaviestNight()}</Text>
							</View>
						</View>
						</View>
					</View>
					<View style={styles.verticalContainer}>
						<Text style={styles.headerTitle}>This month (in hours)</Text>
						<PureChart
							type='line'
							data={this.state.lineChartData}
							width={'100%'}
							height={200}
							showEvenNumberXaxisLabel={false}
						/>
						<View style={styles.horizontalContainer}>
						<View style={styles.verticalContainer}>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Monthly Average</Text>
								<Text style={styles.text}>Coming soon</Text>
							</View>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Monthly Deviation</Text>
								<Text style={styles.text}>Coming soon</Text>
							</View>
						</View>
						<View style={styles.verticalContainer}>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Most Active</Text>
								<Text style={styles.text}>Coming soon</Text>
							</View>
							<View style={styles.verticalContainer}>
								<Text style={styles.title}>Heaviest Night</Text>
								<Text style={styles.text}>Coming soon</Text>
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
