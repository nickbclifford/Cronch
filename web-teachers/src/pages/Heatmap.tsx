import moment from 'moment';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import HeatmapDisplay from '../components/HeatmapDisplay';
import { Timeslot } from '../model/Timeslot';
import styles from './Heatmap.module.scss';

interface HeatmapState {
	timeslots: Timeslot[];
	timeslotsByWeekday: Timeslot[][];
}

class Heatmap extends React.Component<RouteComponentProps & WithAnalyticsContextProps, HeatmapState> {

	constructor(props: any) {
		super(props);
		this.state = { timeslots: [], timeslotsByWeekday: [] };
	}

	componentDidMount() {
		this.props.analyticsContext.timeslots.subscribe(timeslots => {
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

			console.log(this.state.timeslotsByWeekday);
		});
	}

	render() {
		return (
			<div className='container'>
				<h1 className={styles.header}>Heatmap By Day in Week</h1>
				<div className={styles.heatmapsContainer}>
					{this.state.timeslotsByWeekday.map((weekdayTimeslots, i) => 
						<div className={styles.heatmap}>
							<HeatmapDisplay key={i} timeslots={weekdayTimeslots} />
							<h3>{moment(weekdayTimeslots[0].start).format('ddd')}</h3>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default withAnalyticsContext(Heatmap);
