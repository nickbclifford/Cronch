import moment from 'moment';
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { RouteComponentProps } from 'react-router-dom';
import { Subscription } from 'rxjs';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import { UniqueEventWithData } from '../model/Analytics';
import classStyles from './ClassAnalytics.module.scss';
import listStyles from './ClassList.module.scss';

export interface EventAnalyticsRouteParams {
	className: string;
	eventId: string;
}

interface EventAnalyticsState {
	event: UniqueEventWithData | null;
	data: any;
	options: any;
}

class EventAnalytics extends React.Component<RouteComponentProps<EventAnalyticsRouteParams> & WithAnalyticsContextProps, EventAnalyticsState> {

	analyticsSubscription: Subscription | null = null;

	constructor(props: any) {
		super(props);
		this.state = { event: null, data: null, options: null };
	}

	componentDidMount() {
		this.analyticsSubscription = this.props.analyticsContext.canvasEventsWithData.subscribe(
			canvasEvents => {
				if (canvasEvents) {
					const className = this.props.match.params.className;
					const eventId = this.props.match.params.eventId;

					if (!canvasEvents[className]) {
						this.props.history.push('/classes');
						return;
					}

					const event = canvasEvents[className][eventId];

					if (!event) {
						this.props.history.push(`/classes/${className}`);
						return;
					}

					// Calculate bar graph data
					const durationToAmount: { [duration: string]: number } = {};
					for (const user of Object.keys(event.stats.userDurations)) {
						const duration = moment.duration(event.stats.userDurations[user]).asMinutes().toFixed(0);
						if (!durationToAmount[duration]) {
							durationToAmount[duration] = 0;
						}
						durationToAmount[duration]++;
					}

					const data = [];
					for (const duration of Object.keys(durationToAmount).map(i => parseInt(i, 10))) {
						data.push({
							x: duration,
							y: durationToAmount[duration] - 1
						});
					}

					this.setState({
						event,
						data: {
							datasets: [{
								label: 'Homework Workload Distribution (minutes)',
								backgroundColor: [
									'rgba(124, 22, 165, 0.2)'
								],
								borderColor: [
									'rgba(84, 1, 116, 0.5)'
								],
								borderWidth: 10,
								data
							}]
						},
						options: {
							scales: {
							// 	xAxes: [{
							// 		type: 'time',
							// 		time: {
							// 			unit: 'hour'
							// 		}
							// 	}]
								yAxes: [{
									ticks: {
										beginAtZero: true,
										suggestedMax: 0,
										suggestedMin: 0
										// min: 0,
										// scale: 1
									},
									grdLines: {
										display: false
									}
								}]
							}
						}
					});
				} else {
					this.setState({ event: null });
				}
			},
			err => alert(`Get Assignment Error! ${err.message}`)
		);
	}

	componentWillUnmount() {
		if (this.analyticsSubscription) {
			this.analyticsSubscription.unsubscribe();
		}
	}

	render() {
		const event = this.state.event;

		let average = '';
		let min = '';
		let max = '';

		if (event) {
			average = moment.duration(event.stats.average).asMinutes().toFixed(2);
			min = moment.duration(event.stats.min).asMinutes().toFixed(2);
			max = moment.duration(event.stats.max).asMinutes().toFixed(2);
		}

		return (
			<div className='container'>
				<h1 className={listStyles.header}>{this.state.event ? this.state.event.name : 'Assignment Analytics'}</h1>
				{this.state.event && (
					<div className={classStyles.classStats}>
						<div className={classStyles.classStat}>
							<p className={classStyles.statLabel}>Average Workload</p>
							<h3 className={classStyles.statNumber}>{average}m</h3>
						</div>
						<div className={classStyles.classStat}>
							<p className={classStyles.statLabel}>Minimum Workload</p>
							<h3 className={classStyles.statNumber}>{min}m</h3>
						</div>
						<div className={classStyles.classStat}>
							<p className={classStyles.statLabel}>Maximum Workload</p>
							<h3 className={classStyles.statNumber}>{max}m</h3>
						</div>
					</div>
				)}
				{this.state.data && this.state.options && (
					<div className={classStyles.chartContainer}>
						<Scatter
							height={100}
							data={this.state.data}
							options={this.state.options}
						/>
					</div>
				)}
			</div>
		);
	}
}

export default withAnalyticsContext(EventAnalytics);
