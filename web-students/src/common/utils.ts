import { map, switchMap } from 'rxjs/operators';
import config from '../config';
import MyMICDS from './sdk';

export type APIResponse<T> =
	| { error: string; data: null }
	| { error: null; data: T };

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
			return fetch(config.backendUrl + route, injectedOptions);
		}),
		switchMap(body => body.json()),
		map((res: APIResponse<T>) => {
			if (res.error) {
				throw new Error(res.error);
			}

			// TS should be narrowing this to T instead of (T | null), not sure why it's not
			return res.data as T;
		})
	);
}
