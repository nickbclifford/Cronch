import { UniqueEvent } from '../common/MyMICDS';
import { Timeslot } from './Timeslot';

export interface CanvasEventsWithData {
	[className: string]: {
		[eventName: string]: UniqueEventWithData;
	};
}

export interface UniqueEventWithData extends UniqueEvent {
	timeslots: Timeslot[];
	stats: {
		min: number;
		max: number;
		average: number;
		userDurations: { [user: string]: number };
	};
}

export interface EventIdToUniqueEvent {
	[assignmentId: string]: UniqueEvent;
}

export interface HourPortions {
	[hour: number]: number;
}

export function calculateHourPortions(timeslot: Timeslot) {
	const hours: HourPortions = {};

	if (!timeslot.end) {
		return hours;
	}

	const start = timeslot.start;
	const end = timeslot.end;

	const startHour = start.hour();
	const endHour = end.hour();

	// Check if timeslot begins and ends in same hour
	if (startHour === endHour) {
		const diff = end.diff(start, 'hour', true);
		hours[startHour] = diff;
		return hours;
	}

	// Get remaining hour of start
	const endOfFirstHour = start.clone().endOf('hour');
	hours[startHour] = endOfFirstHour.diff(start, 'hour', true);

	for (let i = startHour + 1; i < endHour; i++) {
		hours[i] = 1;
	}

	const startOfEndHour = end.clone().startOf('hour');
	hours[endHour] = end.diff(startOfEndHour, 'hour', true);

	return hours;
}
