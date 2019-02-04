import { DataSharing } from '../../backend/src/models/User';
import { convertJSONDates, Timeslot } from './Timeslot';
import { fetchWithJwt, Omit } from './Utils';

export interface User {
	username: string;
	dataSharing: DataSharing;
}

export function registerUser() {
	return fetchWithJwt('/user', {
		method: 'POST'
	});
}

export function getUserInfo() {
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
