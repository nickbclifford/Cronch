import moment from 'moment';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import HeatmapDisplay from '../components/HeatmapDisplay';
import { Timeslot } from '../model/Timeslot';

interface HeatmapState {
	timeslots: Timeslot[];
}

class Heatmap extends React.Component<RouteComponentProps & WithAnalyticsContextProps, HeatmapState> {

	constructor(props: any) {
		super(props);
		this.state = { timeslots: [
			// {
			// 	id: 123,
			// 	start: moment().startOf('day').hour(11).minute(45),
			// 	end: moment().startOf('day').hour(11).minute(50),
			// 	// end: moment().startOf('day').hour(13).minute(45),
			// 	classId: 'buh',
			// 	user: 'yuh'
			// }
		] };
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
			<div>
				<HeatmapDisplay timeslots={this.state.timeslots} />
			</div>
		);
	}
}

export default withAnalyticsContext(Heatmap);
