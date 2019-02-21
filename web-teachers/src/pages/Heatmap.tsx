import moment from 'moment';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import HeatmapDisplay from '../components/HeatmapDisplay';
import { Timeslot } from '../model/Timeslot';
import styles from './Heatmap.module.scss';

interface HeatmapState {
	timeslots: Timeslot[];
}

class Heatmap extends React.Component<RouteComponentProps & WithAnalyticsContextProps, HeatmapState> {

	constructor(props: any) {
		super(props);
		this.state = { timeslots: [] };
	}

	componentDidMount() {
		this.props.analyticsContext.timeslots.subscribe(timeslots => {
			if (timeslots) {
				this.setState({ timeslots });
			} else {
				this.setState({ timeslots: [] });
			}
		});
	}

	render() {
		return (
			<div className='container'>
				<h1 className={styles.header}>Heatmap</h1>
				<div>
					<HeatmapDisplay timeslots={this.state.timeslots} />
				</div>
			</div>
		);
	}
}

export default withAnalyticsContext(Heatmap);
