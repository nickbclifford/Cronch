import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import MyMICDS from '../common/MyMICDS';

export default class Login extends React.Component<RouteComponentProps> {

	componentDidMount() {
		MyMICDS.auth.logout().subscribe({
			complete: () => {
				this.props.history.push('/');
			}
		});
	}

	render() {
		return null;
	}
}
