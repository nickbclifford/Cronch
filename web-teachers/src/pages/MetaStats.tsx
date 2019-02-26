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
	stats: { count: number, average: number, max: number } | null;
	data: any;
	options: any;
}

class MetaStats extends React.Component<RouteComponentProps & WithAnalyticsContextProps, MetaStatsState> {

	analyticsSubscription: Subscription | null = null;

	constructor(props: any) {
		super(props);
		this.state = { timeslots: [], data: null, options: null, stats: null };
	}

	componentDidMount() {
		this.analyticsSubscription = this.props.analyticsContext.timeslots.subscribe(timeslots => {
			if (timeslots) {

				// Calculate line graph data
				const startEndCount: { [timestamp: number]: number } = {};
				for (const timeslot of timeslots) {
					if (!timeslot.end) {
						continue;
					}

					const start = timeslot.start.clone().startOf('day').valueOf();
					const end = timeslot.end.clone().startOf('day').valueOf();

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
				}

				const data = [];
				for (const date of Object.keys(startEndCount).map(k => parseInt(k, 10))) {
					data.push({
						x: moment(date),
						y: startEndCount[date]
					});
				}

				data.sort((a, b) => a.x.valueOf() - b.x.valueOf());

				const { count, total, max } = timeslots.reduce((stats, timeslot) => {
					if (timeslot.end) {
						const diff = timeslot.end.diff(timeslot.start, 'minutes');
						stats.total += diff;
						stats.count++;
						stats.max = Math.max(stats.max, diff);
					}
					return stats;
				}, { count: 0, total: 0, max: 0 });

				const stats = {
					count,
					average: total / count,
					max
				};

				this.setState({
					timeslots,
					stats,
					data: {
						datasets: [{
							label: 'Timeslots Created',
							backgroundColor: [
								'rgba(124, 22, 165, 0.2)'
							],
							borderColor: [
								'rgba(84, 1, 116, 0.5)'
							],
							data
						}]
					},
					options: {
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
				{this.state.stats && (
					<div className={classStyles.classStats}>
						<div className={classStyles.classStat}>
							<p className={classStyles.statLabel}>Total Timeslots</p>
							<h3 className={classStyles.statNumber}>{this.state.stats.count}</h3>
						</div>
						<div className={classStyles.classStat}>
							<p className={classStyles.statLabel}>Average Timeslot Time</p>
							<h3 className={classStyles.statNumber}>{this.state.stats.average.toFixed(0)}m</h3>
						</div>
						<div className={classStyles.classStat}>
							<p className={classStyles.statLabel}>Maximum Timeslot Time</p>
							<h3 className={classStyles.statNumber}>{this.state.stats.max}m</h3>
						</div>
					</div>
				)}
				{this.state.data && this.state.options && (
					<Line
						data={this.state.data}
						options={this.state.options}
					/>
				)}
			</div>
		);
	}
}

export default withAnalyticsContext(MetaStats);
