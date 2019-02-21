import { map, switchMap } from 'rxjs/operators';

import Config from '../Config';
import MyMICDS from './MyMICDS';

export interface APIResponse<T> {
	error: string | null;
	data: T | null;
}

export function fetchWithJwt<T>(route: string, options: RequestInit) {
	// These will only be called when the user is logged in, so we can safely say that JWT will always be defined
	return MyMICDS.getJwt().pipe(
		switchMap(jwt => {
			const defaultHeaders: { [key: string]: string } = {
				'Content-Type': 'application/json'
			};
			if (jwt) {
				defaultHeaders.Authorization = `Bearer ${jwt}`;
			}
			const injectedOptions = Object.assign(options, { headers: defaultHeaders });
			return fetch(Config.backendUrl + route, injectedOptions);
		}),
		switchMap(body => body.json()),
		map((res: APIResponse<T>) => {
			if (typeof res.error === 'string') {
				throw new Error(res.error);
			} else {
				return res.data!;
			}
		})
	);
}

export function pickProps<T, K extends keyof T>(obj: T, keys: K[]) {
	const newObj: Partial<Pick<T, K>> = {};

	for (const key of keys) {
		newObj[key] = obj[key];
	}

	return newObj as Pick<T, K>;
}
