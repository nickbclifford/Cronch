import { Permissions } from 'expo';
import { fetchWithJwt } from './Utils';

export interface NotificationToken {
	expoToken: string;
}

export function getNotificationPermissions() {
	return Permissions.askAsync(Permissions.NOTIFICATIONS).then(p => p.status);
}

export function submitNotificationToken(expoToken: string) {
	return fetchWithJwt('/notification-token', {
		method: 'POST',
		body: JSON.stringify({ expoToken })
	});
}
