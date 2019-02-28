import moment from 'moment';
import { map } from 'rxjs/operators';

import { fetchWithJwt } from '../common/Utils';

export interface Timeslot {
	id: number;
	start: moment.Moment;
	end: moment.Moment | null;
	classId: string;
	user: string;
}

export interface DBTimeslot {
	id: number;
	start: Date;
	end: Date | null;
	classId: string;
	user: string;
}

interface RawTimeslots {
	timeslots: RawTimeslot[];
}

interface RawTimeslot {
	id: number;
	start: string;
	end: string | null;
	classId: string;
	user: string;
}

export function getAllTimeslots() {
	return fetchWithJwt<RawTimeslots | null>('/timeslot/all', {
		method: 'GET'
	}).pipe(
		map(({ timeslots }) => {
			console.log('timeslot', timeslots);
			return timeslots.map(convertJSONDates);
		})
	);
}

export function convertJSONDates(t: RawTimeslot): Timeslot {
	return {
		id: t.id,
		start: moment(t.start),
		end: typeof t.end === 'string' ? moment(t.end) : null,
		classId: t.classId,
		user: t.user
	};
}
