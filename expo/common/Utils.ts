import { FormikProps } from 'formik';
import moment from 'moment';
import { AsyncStorage } from 'react-native';

import Config from '../Config';
import { GetUserInfoResponse, jwtKey } from './MyMICDS';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface APIResponse<T> {
	error: string | null;
	data: T | null;
}

export async function fetchWithJwt<T>(route: string, options: RequestInit) {
	// These will only be called when the user is logged in, so we can safely say that JWT will always be defined
	const jwt = await AsyncStorage.getItem(jwtKey)!;
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

export function humanReadableTimeUntil(date: moment.Moment) {
	return date.calendar(undefined, {
		sameDay: '[Today]',
		nextDay: '[Tomorrow]',
		nextWeek: 'dddd',
		lastDay: '[Yesterday]',
		lastWeek: '[Last] dddd',
		sameElse: 'MM/DD'
	});
}

export function oxfordCommaList(arr: string[], separator = 'and'): string {
	switch (arr.length) {
		case 1:
		return arr[0];
		case 2:
		return `${arr[0]} ${separator} ${arr[1]}`;
		default:
		const last = arr.pop();
		return `${arr.join(', ')}, ${separator} ${last}`;
	}
}

export function getMissingURLs(user: GetUserInfoResponse) {
	const urls: string[] = [];
	let hasRequired = false;

	if (user.canvasURL === null) {
		urls.push('Canvas');
	} else {
		hasRequired = true;
	}

	if (user.portalURLCalendar === null || user.portalURLClasses === null) {
		urls.push('Portal');
	}

	return {
		urls,
		hasRequired
	};
}

export function handleFieldChangeFactory<T>(props: FormikProps<T>, field: keyof T) {
	return (value: any) => {
		props.setFieldValue(field as string, value);
	};
}

export function optionalFunction<T extends any[]>(func?: (...args: T) => void, ...args: T) {
	return () => {
		if (func) {
			func(...args);
		}
	};
}

// tfw exactly what the Pick<T, K> type was designed for
export function pickProps<T, K extends keyof T>(obj: T, keys: K[]) {
	const newObj: Partial<Pick<T, K>> = {};

	for (const key of keys) {
		newObj[key] = obj[key];
	}

	return newObj as Pick<T, K>;
}
