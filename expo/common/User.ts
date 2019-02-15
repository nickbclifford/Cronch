import { DataSharing } from '../../backend/src/models/User';
import { convertJSONDates, Timeslot } from './Timeslot';
import { fetchWithJwt, Omit } from './Utils';

export interface User {
	username: string;
	dataSharing: DataSharing;
	alarm: number;
	timers: TimerData[];
}

export interface TimerData { work: number; break: number; selected: boolean; }

export function registerUser() {
	return fetchWithJwt('/user', {
		method: 'POST'
	});
}

export function getUser() {
	return fetchWithJwt<User>('/user', {
		method: 'GET'
	});
}

export function changeUserInfo(info: Omit<Partial<User>, 'username'>) {
	return fetchWithJwt('/user', {
		method: 'PATCH',
		body: JSON.stringify(info)
	});
}

export function getUserTimeslots() {
	return fetchWithJwt<Timeslot[]>('/user/timeslots', {
		method: 'GET'
	}).then(ts => ts.map(convertJSONDates));
}

export function updateTimers(timers: TimerData[]) {
	return fetchWithJwt<TimerData[]>('/user/timers', {
		method: 'POST',
		body: JSON.stringify({timers})
	});
}

export function getTimers() {
	return fetchWithJwt<TimerData[]>('/user/timeslots', {
		method: 'GET'
	});
}
