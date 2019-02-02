import { fetchWithJwt } from './Utils';

export interface Timeslot {
	id: number;
	start: Date;
	end: Date | null;
	canvasId: string;
	user: string;
}

export function create(start: Date, canvasId: string) {
	return fetchWithJwt('/timeslot', {
		method: 'POST',
		body: JSON.stringify({ start, canvasId })
	});
}

export function end(id: number, endDate: Date) {
	return fetchWithJwt('/timeslot/end', {
		method: 'POST',
		body: JSON.stringify({ id, end: endDate })
	});
}

export function get(id: number) {
	return fetchWithJwt<Timeslot>(`/timeslot/${id}`, {
		method: 'GET'
	}).then(convertJSONDates);
}

export function convertJSONDates(t: Timeslot) {
	t.start = new Date(t.start);
	// Don't do a Date conversion if end is still null
	if (typeof t.end === 'string') {
		t.end = new Date(t.end);
	}

	return t;
}
