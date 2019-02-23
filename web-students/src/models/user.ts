import { fetchWithJwt } from '../common/utils';

// TODO: types and stuff ig
export function getUser() {
	return fetchWithJwt('/user', {
		method: 'GET'
	});
}
