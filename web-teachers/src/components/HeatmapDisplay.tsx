import React from 'react';
import ReactTooltip from 'react-tooltip';

import { calculateHourPortions, HourPortions } from '../model/Analytics';
import { Timeslot } from '../model/Timeslot';
import styles from './HeatmapDisplay.module.scss';

export interface HeatmapDisplayProps {
	timeslots: Timeslot[];
	getLocalMax?: (max: number) => void;
	setMax?: number;
}

interface HeatmapDisplayState {
	hourPortions: HourPortions;
	localMax: number;
}

export default class HeatmapDisplay extends React.Component<HeatmapDisplayProps, HeatmapDisplayState> {

	constructor(props: any) {
		super(props);
		this.state = { hourPortions: {}, localMax: 0 };
	}

	componentDidMount() {
		this.updateHeatmapState(this.props.timeslots);
	}

	componentDidUpdate(prevProps: HeatmapDisplayProps) {
		if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
			this.updateHeatmapState(this.props.timeslots);
		}
	}

	private updateHeatmapState(timeslots: Timeslot[]) {
		const rawPortions = this.calculateHeatmap(timeslots);

		const portions: HourPortions = {};
		for (let i = 0; i < 24; i++) {
			portions[i] = rawPortions[i] || 0;
		}

		this.setState({ hourPortions: portions });

		const localMax = Math.max(...Object.values(portions));
		if (Number.isFinite(localMax) && localMax !== this.state.localMax) {
			this.setState({ localMax });
			if (this.props.getLocalMax) {
				this.props.getLocalMax(localMax);
			}
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
		const hours = Object.keys(this.state.hourPortions).map(k => parseInt(k, 10));

		const max = this.props.setMax || this.state.localMax;

		const labels = hours.map(hour => {
			const suffix = hour < 12 ? 'am' : 'pm';
			return `${(hour + 11) % 12 + 1} ${suffix}`;
		});

		const tooltips = hours.map(hour => {
			return `(${hour}:00-${hour + 1}:00) ${this.state.hourPortions[hour].toFixed(2)} hours worked`;
			// return `${portions[hour].toFixed(2)} hours worked`;
		});

		ReactTooltip.rebuild();

		return (
			<div className={styles.heatmapContainer}>
				{hours.map((hour, i) => (
					<div key={hour} className={styles.heatmapDataContainer}>
						{i % 2 === 0 && (<div className={styles.heatmapLabel}>{labels[i]}</div>)}
						<div
							className={styles.heatmapData}
							style={this.calculateColor(this.state.hourPortions[hour] / max)}
							data-tip={tooltips[i]}
						></div>
					</div>
				))}
				<ReactTooltip />
			</div>
		);
	}
}
