import { fetchWithJwt } from './Utils';

export interface BattlePlanTask {
	id: number;
	user: string;
	planOrder: number;
	taskId: string;
}

export function saveBattlePlanTasks(taskIds: string[]) {
	return fetchWithJwt('/battle-plan-tasks', {
		method: 'POST',
		body: JSON.stringify(taskIds)
	});
}
