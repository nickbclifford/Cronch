import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import MyMICDS from '../common/MyMICDS';

export default class Login extends React.Component<RouteComponentProps> {

	componentDidMount() {
		MyMICDS.auth.logout().pipe(
			catchError(() => of({})),
			switchMap(() => MyMICDS.clearJwt())
		).subscribe({
			complete: () => {
				this.props.history.push('/');
			}
		});
	}

	render() {
		return null;
	}
}
