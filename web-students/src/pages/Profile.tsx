import bind from 'bind-decorator';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import MyMICDS from '../common/sdk';
import { Button } from '../common/styles';

class Profile extends React.Component<RouteComponentProps> {

	// noinspection JSUnusedLocalSymbols
	@bind
	private logout(event: React.MouseEvent<HTMLButtonElement>) {
		MyMICDS.auth.logout().subscribe(() => this.props.history.push('/'));
	}

	render() {
		return (
			<div>
				<p>logged in as some dude idk</p>
				<Button onClick={this.logout}>Logout</Button>
			</div>
		);
	}

}

export default withRouter(Profile);
