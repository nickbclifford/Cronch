import { convertJSONDates, Timeslot } from './Timeslot';
import { fetchWithJwt, Omit } from './Utils';

export interface User {
	username: string;
	dataSharing: boolean;
}

export function register() {
	return fetchWithJwt('/user', {
		method: 'POST'
	});
}

export function getInfo() {
	return fetchWithJwt<User>('/user', {
		method: 'GET'
	});
}

export function changeInfo(info: Omit<Partial<User>, 'username'>) {
	return fetchWithJwt('/user', {
		method: 'PATCH',
		body: JSON.stringify(info)
	});
}

export function getTimeslots() {
	return fetchWithJwt<Timeslot[]>('/user/timeslots', {
		method: 'GET'
	}).then(ts => ts.map(convertJSONDates));
}
