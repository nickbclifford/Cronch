import { DataSharing } from '../../backend/src/models/User';
import { BattlePlanTask } from './BattlePlanTask';
import { convertJSONDates, Timeslot } from './Timeslot';
import { fetchWithJwt, Omit } from './Utils';

export interface GetUserResponse {
	user: User | null;
}

export interface User {
	username: string;
	dataSharing: DataSharing;
	alarm: number;
}

export function registerUser() {
	return fetchWithJwt('/user', {
		method: 'POST'
	});
}

export function getUser() {
	return fetchWithJwt<GetUserResponse>('/user', {
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

export function getUserBattlePlanTasks() {
	return fetchWithJwt<BattlePlanTask[]>('/user/battle-plan-tasks', {
		method: 'GET'
	});
}
