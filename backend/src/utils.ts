import { RequestHandler, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { promisify } from 'util';
import config from './config';

export function successResponse(res: Response, data: object = {}) {
	res.json({
		error: null,
		data
	});
}

export class APIError extends Error {
	constructor(message: string, readonly statusCode = 500) {
		super(message);
	}
}

export function errorResponse(res: Response, err: Error) {
	let statusCode = 500;
	if (err instanceof APIError) { statusCode = err.statusCode; }

	res.status(statusCode).json({
		error: err.message,
		data: null
	});
}

declare global {
	namespace Express {
		// noinspection JSUnusedGlobalSymbols
		interface Request {
			authorizedUser: string | null;
		}
	}
}

export const jwtMiddleware: RequestHandler = (req, res, next) => {
	req.authorizedUser = null;

	const header = req.headers.authorization;

	// If there's no auth header, it's probably fine and we can just ignore it
	if (typeof header === 'undefined') {
		next();
		return;
	}

	// Otherwise, make sure it's in the correct format
	if (!header.startsWith('Bearer ')) {
		errorResponse(res, new APIError('Invalid authorization header', 400));
		next();
		return;
	}

	// Finally, do all the important verification stuff
	promisify(verify)(header.substring(7), config.mymicdsJwtSecret).then((payload: { [key: string]: any }) => {
		req.authorizedUser = payload.user;
	}).catch(() => {
		errorResponse(res, new APIError('Invalid authorization token', 401));
	}).finally(next);
};

export const requireLoggedIn: RequestHandler = (req, res, next) => {
	if (req.authorizedUser === null) {
		errorResponse(res, new APIError('Unauthorized', 401));
	}

	next();
};