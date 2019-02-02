import Config from './Config';
import MyMICDS from './MyMICDS';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface APIResponse<T> {
	error: string | null;
	data: T | null;
}

export async function fetchWithJwt<T>(route: string, options: RequestInit) {
	// These will only be called when the user is logged in, so we can safely say that JWT will always be defined
	const jwt = await MyMICDS.auth.$.toPromise();
	const injectedOptions = Object.assign(options, {
		headers: {
			'Authorization': `Bearer ${jwt}`,
			'Content-Type': 'application/json'
		}
	});

	const body = await fetch(Config.backendUrl + route, injectedOptions);
	const res: APIResponse<T> = await body.json();

	if (typeof res.error === 'string') {
		throw new Error(res.error);
	} else {
		return res.data!;
	}
}
