import React from 'react';

import { calculateHourPortions, HourPortions } from '../model/Analytics';
import { Timeslot } from '../model/Timeslot';

export interface HeatmapDisplayProps {
	timeslots: Timeslot[];
}

interface HeatmapDisplayState {
	hourPortions: HourPortions;
}

export default class HeatmapDisplay extends React.Component<HeatmapDisplayProps, HeatmapDisplayState> {

	constructor(props: any) {
		super(props);
		this.state = { hourPortions: {} };
	}

	componentDidMount() {
		this.setState({ hourPortions: this.calculateHeatmap(this.props.timeslots) });
	}

	componentDidUpdate(prevProps: HeatmapDisplayProps) {
		if (JSON.stringify(prevProps.timeslots) !== JSON.stringify(this.props.timeslots)) {
			this.setState({ hourPortions: this.calculateHeatmap(this.props.timeslots) });
		}
	}

	private calculateHeatmap(timeslots: Timeslot[]) {
		const hourPortions: HourPortions = {};
		for (const timeslot of timeslots) {
			const slotPortions = calculateHourPortions(timeslot);
			for (const hour of Object.keys(slotPortions).map(k => parseInt(k, 10))) {
				if (!hourPortions[hour]) {
					hourPortions[hour] = 0;
				}
				hourPortions[hour] += slotPortions[hour];
			}
		}
		return hourPortions;
	}

	render() {
		const portions: HourPortions = {};
		for (let i = 0; i < 23; i++) {
			portions[i] = this.state.hourPortions[i] || 0;
		}
		const hours = Object.keys(portions).map(k => parseInt(k, 10));
		return (
			<div>
				{hours.map(hour => (
					<div key={hour}>{hour}: {portions[hour]}</div>
				))}
			</div>
		);
	}
}
