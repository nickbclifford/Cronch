import Config from './Config';
import MyMICDS from './MyMICDS';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface APIResponse<T> {
	error: string | null;
	data: T | null;
}

export function fetchWithJwt<T>(route: string, options: RequestInit) {
	// These will only be called when the user is logged in, so we can safely say that JWT will always be defined
	return MyMICDS.auth.$.toPromise().then(jwt => {
		const injectedOptions = Object.assign(options, {
			headers: {
				'Authorization': `Bearer ${jwt}`,
				'Content-Type': 'application/json'
			}
		});
		return fetch(Config.backendUrl + route, injectedOptions);
	}).then<APIResponse<T>>(r => r.json()).then(res => {
		if (typeof res.error === 'string') {
			return Promise.reject(new Error(res.error));
		} else {
			return Promise.resolve(res.data!);
		}
	});
}
