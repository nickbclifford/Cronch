import moment from 'moment';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { RouteComponentProps } from 'react-router-dom';
import { Subscription } from 'rxjs';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import { Timeslot } from '../model/Timeslot';
import classStyles from './ClassAnalytics.module.scss';

interface MetaStatsState {
	timeslots: Timeslot[];
	timeslotStats: { count: number, average: number, max: number } | null;
	timeslotData: any;
	userStats: { count: number, average: number, max: number } | null;
	userData: any;
	options: any;
}

class MetaStats extends React.Component<RouteComponentProps & WithAnalyticsContextProps, MetaStatsState> {

	analyticsSubscription: Subscription | null = null;

	constructor(props: any) {
		super(props);
		this.state = {
			timeslots: [],
			timeslotStats: null,
			timeslotData: null,
			userData: null,
			userStats: null,
			options: null
		};
	}

	componentDidMount() {
		this.analyticsSubscription = this.props.analyticsContext.timeslots.subscribe(timeslots => {
			if (timeslots) {

				// Calculate line graph data
				const startEndCount: { [timestamp: number]: number } = {};
				const userCount: { [timestamp: number]: string[] } = {};
				const uniqueUsers: string[] = [];

				for (const timeslot of timeslots) {
					if (!timeslot.end) {
						continue;
					}

					const start = timeslot.start.clone().startOf('day').valueOf();
					const end = timeslot.end.clone().startOf('day').valueOf();

					// Add to start count
					if (!startEndCount[start]) {
						startEndCount[start] = 0;
					}
					startEndCount[start]++;

					if (start !== end) {
						if (!startEndCount[end]) {
							startEndCount[end] = 0;
						}
						startEndCount[end]++;
					}

					// Add user to count
					if (!uniqueUsers.includes(timeslot.user)) {
						uniqueUsers.push(timeslot.user);
					}

					if (!userCount[start]) {
						userCount[start] = [];
					}
					if (!userCount[start].includes(timeslot.user)) {
						userCount[start].push(timeslot.user);
					}

					if (start !== end) {
						if (!userCount[end]) {
							userCount[end] = [];
						}
						if (!userCount[end].includes(timeslot.user)) {
							userCount[end].push(timeslot.user);
						}
					}
				}

				// Format timeslot data for Chart.js
				const timeslotData = [];
				for (const date of Object.keys(startEndCount).map(k => parseInt(k, 10))) {
					timeslotData.push({
						x: moment(date),
						y: startEndCount[date]
					});
				}
				timeslotData.sort((a, b) => a.x.valueOf() - b.x.valueOf());

				const { count, total, max } = timeslots.reduce((stats, timeslot) => {
					if (timeslot.end) {
						const diff = timeslot.end.diff(timeslot.start, 'minutes');
						stats.total += diff;
						stats.count++;
						stats.max = Math.max(stats.max, diff);
					}
					return stats;
				}, { count: 0, total: 0, max: 0 });

				const timeslotStats = {
					count,
					average: total / count,
					max
				};

				// Format user data for Chart.js
				const userData = [];
				let userDailyTotal = 0;
				let userDayMax = 0;
				for (const date of Object.keys(userCount).map(k => parseInt(k, 10))) {
					const count = userCount[date].length;
					userData.push({
						x: moment(date),
						y: count
					});
					userDailyTotal += count;
					if (userDayMax < count) {
						userDayMax = count;
					}
				}
				userData.sort((a, b) => a.x.valueOf() - b.x.valueOf());

				const firstDate = userData[0].x;
				const lastDate = userData[userData.length - 1].x;
				const userDays = lastDate.diff(firstDate, 'day');

				const userStats = {
					count: uniqueUsers.length,
					average: userDailyTotal / userDays,
					max: userDayMax
				};

				this.setState({
					timeslots,
					timeslotStats,
					timeslotData: {
						datasets: [{
							label: 'Timeslots Created',
							backgroundColor: [
								'rgba(124, 22, 165, 0.2)'
							],
							borderColor: [
								'rgba(84, 1, 116, 0.5)'
							],
							data: timeslotData
						}]
					},
					userStats,
					userData: {
						datasets: [{
							label: 'Users',
							backgroundColor: [
								'rgba(124, 22, 165, 0.2)'
							],
							borderColor: [
								'rgba(84, 1, 116, 0.5)'
							],
							data: userData
						}]
					},
					options: {
						legend: {
							display: false
						},
						scales: {
							xAxes: [{
								type: 'time',
								time: {
									unit: 'day'
								}
							}]
						}
					}
				});
			} else {
				this.setState({ timeslots: [] });
			}
		});
	}

	componentWillUnmount() {
		if (this.analyticsSubscription) {
			this.analyticsSubscription.unsubscribe();
		}
	}

	render() {
		return (
			<div className='container'>
				<h1 className='cronch-header'>Meta Stats</h1>
				{this.state.timeslotStats && this.state.timeslotData && this.state.options && (
					<>
						<h2 className='cronch-header'>Timeslots Created</h2>
						<div className={classStyles.classStats}>
							<div className={classStyles.classStat}>
								<p className={classStyles.statLabel}>Total Timeslots</p>
								<h3 className={classStyles.statNumber}>{this.state.timeslotStats.count}</h3>
							</div>
							<div className={classStyles.classStat}>
								<p className={classStyles.statLabel}>Average Timeslot Time</p>
								<h3 className={classStyles.statNumber}>{this.state.timeslotStats.average.toFixed(0)}m</h3>
							</div>
							<div className={classStyles.classStat}>
								<p className={classStyles.statLabel}>Maximum Timeslot Time</p>
								<h3 className={classStyles.statNumber}>{this.state.timeslotStats.max}m</h3>
							</div>
						</div>
						<div className='cronch-chart-container'>
							<Line
								data={this.state.timeslotData}
								options={this.state.options}
							/>
						</div>
					</>
				)}
				{this.state.userStats && this.state.timeslotData && this.state.options && (
					<>
						<h2 className='cronch-header'>Users</h2>
						<div className={classStyles.classStats}>
							<div className={classStyles.classStat}>
								<p className={classStyles.statLabel}>Total Users</p>
								<h3 className={classStyles.statNumber}>{this.state.userStats.count}</h3>
							</div>
							<div className={classStyles.classStat}>
								<p className={classStyles.statLabel}>Average Users per Day</p>
								<h3 className={classStyles.statNumber}>{this.state.userStats.average.toFixed(0)}</h3>
							</div>
							<div className={classStyles.classStat}>
								<p className={classStyles.statLabel}>Maximum Users in Single Day</p>
								<h3 className={classStyles.statNumber}>{this.state.userStats.max}</h3>
							</div>
						</div>
						<div className='cronch-chart-container'>
							<Line
								data={this.state.userData}
								options={this.state.options}
							/>
						</div>
					</>
				)}
			</div>
		);
	}
}

export default withAnalyticsContext(MetaStats);
