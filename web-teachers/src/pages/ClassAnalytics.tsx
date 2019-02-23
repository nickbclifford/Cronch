import moment from 'moment';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Subscription } from 'rxjs';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import { UniqueEventWithData } from '../model/Analytics';
import styles from './ClassAnalytics.module.scss';
import listStyles from './ClassList.module.scss';

export interface ClassAnalyticsRouteParams {
	className: string;
}

interface ClassAnalyticsState {
	loading: boolean;
	className: string | null;
	events: UniqueEventWithData[];
	data: any;
	options: any;
}

class ClassAnalytics extends React.Component<RouteComponentProps<ClassAnalyticsRouteParams> & WithAnalyticsContextProps, ClassAnalyticsState> {

	analyticsSubscription: Subscription | null = null;

	constructor(props: any) {
		super(props);
		this.state = { loading: true, className: null, events: [], data: null, options: null };
	}

	componentDidMount() {
		this.analyticsSubscription = this.props.analyticsContext.canvasEventsWithData.subscribe(
			canvasEvents => {
				if (canvasEvents) {
					this.setState({ loading: false });
					const className = this.props.match.params.className;

					if (!canvasEvents[className]) {
						this.props.history.push('/classes');
						return;
					}

					this.setState({ className });

					const events = [];
					const eventIds = Object.keys(canvasEvents[className]);
					for (const eventId of eventIds) {
						events.push(canvasEvents[className][eventId]);
					}

					events.sort((a, b) => a.end.valueOf() - b.end.valueOf());
					console.log('events for class', events);

					// Calculate line graph data
					const data = [];
					for (const event of events) {
						data.push({
							x: event.end,
							y: moment.duration(event.stats.average).asMinutes().toFixed(0)
						});
					}

					this.setState({
						events,
						data: {
							datasets: [{
								label: 'Average Homework (minutes)',
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
					this.setState({ events: [], data: null });
				}
			},
			err => alert(`Get Classes Error! ${err.message}`)
		);
	}

	componentWillUnmount() {
		if (this.analyticsSubscription) {
			this.analyticsSubscription.unsubscribe();
		}
	}

	render() {

		let combinedAverages = 0;
		let totalMin = Number.POSITIVE_INFINITY;
		let totalMax = 0;

		for (const event of this.state.events) {
			// const duration = even.end.diff(timeslot.start);
			combinedAverages += event.stats.average;
			if (event.stats.min < totalMin) {
				totalMin = event.stats.min;
			}
			if (event.stats.max > totalMax) {
				totalMax = event.stats.max;
			}
		}

		const totalAverage = combinedAverages / this.state.events.length;

		return (
			<div className='container'>
				<h1 className={listStyles.header}>Class Analytics{this.state.className ? ` for ${this.state.className}` : ''}</h1>
				{this.state.loading && (
					<p>Loading...</p>
				)}
				{!this.state.loading && (
					<div>
						<div className={styles.classStats}>
							<div className={styles.classStat}>
								<p className={styles.statLabel}>Average Workload</p>
								<h3 className={styles.statNumber}>{moment.duration(totalAverage).asMinutes().toFixed(2)}m</h3>
							</div>
							<div className={styles.classStat}>
								<p className={styles.statLabel}>Minimum Workload</p>
								<h3 className={styles.statNumber}>{moment.duration(totalMin).asMinutes().toFixed(2)}m</h3>
							</div>
							<div className={styles.classStat}>
								<p className={styles.statLabel}>Maximum Workload</p>
								<h3 className={styles.statNumber}>{moment.duration(totalMax).asMinutes().toFixed(2)}m</h3>
							</div>
						</div>
						{this.state.data && this.state.options && (
							<div className={styles.chartContainer}>
								<Line
									data={this.state.data}
									options={this.state.options}
								/>
							</div>
						)}
						<h2 className={listStyles.header}>Assignments</h2>
						{this.state.events.map(event => (
							<Link key={event._id} to={`/classes/${event.className}/${event._id}`} className={listStyles.link}>
								<div className={listStyles.itemContainer}>
									<h4 className={listStyles.className}>{event.name}</h4>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		);
	}
}

export default withAnalyticsContext(ClassAnalytics);
