import { fetchWithJwt } from './Utils';

export interface Timer {
	id?: number;
	work: number;
	break: number;
}

export function updateTimers(timers: Timer[]) {
	return fetchWithJwt('/timers', {
		method: 'POST',
		body: JSON.stringify({ timers })
	});
}
