import bind from 'bind-decorator';
import moment from 'moment';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Subscription } from 'rxjs';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import HeatmapDisplay from '../components/HeatmapDisplay';
import { Timeslot } from '../model/Timeslot';
import styles from './Heatmap.module.scss';

interface HeatmapState {
	timeslots: Timeslot[];
	timeslotsByWeekday: Timeslot[][];
	maxWeeklyValues: number[];
}

class Heatmap extends React.Component<RouteComponentProps & WithAnalyticsContextProps, HeatmapState> {

	analyticsSubscription: Subscription | null = null;

	constructor(props: any) {
		super(props);
		this.state = { timeslots: [], timeslotsByWeekday: [], maxWeeklyValues: [] };
	}

	componentDidMount() {
		this.analyticsSubscription = this.props.analyticsContext.timeslots.subscribe(timeslots => {
			if (timeslots) {
				const timeslotsByWeekday: Timeslot[][] = [[], [], [], [], [], [], []];

				timeslots.map(timeslot => {
					const dayOfWeek = moment(timeslot.start).weekday();
					timeslotsByWeekday[dayOfWeek].push(timeslot);
				});

				this.setState({ timeslots, timeslotsByWeekday });
			} else {
				this.setState({ timeslots: [], timeslotsByWeekday: [] });
			}
		});
	}

	componentWillUnmount() {
		if (this.analyticsSubscription) {
			this.analyticsSubscription.unsubscribe();
		}
	}

	@bind
	private setMax(index: number) {
		return (max: number) => {
			const maxWeeklyValues = this.state.maxWeeklyValues;
			maxWeeklyValues[index] = max;
			this.setState({ maxWeeklyValues });
		};
	}

	render() {
		return (
			<div className='container'>
				<h1 className='cronch-header'>Heatmap By Weekday</h1>
				<div className={styles.heatmapsContainer}>
					{this.state.timeslotsByWeekday.map((weekdayTimeslots, i) =>
						<div key={i} className={styles.heatmap}>
							<HeatmapDisplay timeslots={weekdayTimeslots} getLocalMax={this.setMax(i)} setMax={Math.max(...this.state.maxWeeklyValues)} />
							<h3 className={styles.heatmapLabel}>{moment(weekdayTimeslots[0].start).format('ddd')}</h3>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default withAnalyticsContext(Heatmap);
