import { DataSharing } from '../../../backend/src/models/User';
import { fetchWithJwt } from '../common/utils';
import { Timer } from './timer';

export interface GetUserResponse {
	user: User | null;
}

export interface User {
	username: string;
	dataSharing: DataSharing;
	alarmSelection: number;
	timers?: Timer[];
	timerSelection: number;
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
