import moment from 'moment';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import { calculateHourPortions, HourPortions } from '../model/Analytics';
import { Timeslot } from '../model/Timeslot';
import styles from './HeatmapDisplay.module.scss';

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

	private calculateColor(percentage: number) {
		const minLightness = 23;
		const maxLightness = 96;

		let lightness = maxLightness;
		if (Number.isFinite(percentage)) {
			lightness = (maxLightness - minLightness) * (1 - percentage) + minLightness;
		}

		const obj = {
			backgroundColor: `hsl(283, 98%, ${lightness}%)`
		};
		return obj;
	}

	render() {
		const portions: HourPortions = {};
		for (let i = 0; i < 24; i++) {
			portions[i] = this.state.hourPortions[i] || 0;
		}
		const hours = Object.keys(portions).map(k => parseInt(k, 10));

		const max = Math.max(...Object.values(portions));

		const labels = hours.map(hour => {
			const suffix = hour < 13 ? 'am' : 'pm';
			return `${(hour + 11) % 12 + 1} ${suffix}`;
		});

		const tooltips = hours.map(hour => {
			return `(${hour}:00-${hour + 1}:00) ${portions[hour].toFixed(2)} hours worked`;
			// return `${portions[hour].toFixed(2)} hours worked`;
		});

		return (
			<div className={styles.heatmapContainer}>
				{hours.map((hour, i) => (
					<div key={hour} className={styles.heatmapDataContainer}>
						<div className={styles.heatmapLabel}>{labels[i]}</div>
						<div
							className={styles.heatmapData}
							style={this.calculateColor(portions[hour] / max)}
							data-tip={tooltips[i]}
						></div>
					</div>
				))}
				<ReactTooltip />
			</div>
		);
	}
}
