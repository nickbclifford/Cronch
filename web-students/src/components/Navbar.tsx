import { IconButton, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { AccountCircle } from '@material-ui/icons';
import bind from 'bind-decorator';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import MyMICDS from '../common/sdk';
import { FabButton } from '../common/styles';
import LoginDialog from './LoginDialog';
import './Navbar.scss';

const tabNameRoutes = [
	['Battle Plan', '/'],
	['Timer', '/timer'],
	['About', '/about']
];

interface NavbarState {
	value: string;
	loginOpen: boolean;
	loggedIn: boolean;
}

class Navbar extends Component<RouteComponentProps, NavbarState> {

	state = {
		value: '/',
		loginOpen: false,
		loggedIn: false
	};

	componentDidMount() {
		MyMICDS.auth.$.subscribe(possiblyJwt => {
			this.setState({ loggedIn: !!possiblyJwt });
		});
	}

	// noinspection JSUnusedLocalSymbols
	@bind
	private handleTabChange(event: React.ChangeEvent<{}>, value: string) {
		this.props.history.push(value);
		this.setState({ value });
	}

	@bind
	private handleLoginButton(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		console.log('test');
		this.setState({ loginOpen: true });
	}

	@bind
	private closeLogin() {
		this.setState({ loginOpen: false });
		this.props.history.push('/');
	}

	@bind
	private goToProfile() {
		this.props.history.push('/profile');
	}

	render() {
		return (
			<>
				<AppBar position='static'>
					<Toolbar className='Toolbar'>
						<Typography color='inherit' variant='h5'>Cronch</Typography>
						<Tabs className='Tabs' centered={true} value={this.state.value} onChange={this.handleTabChange}>
							{tabNameRoutes.map(([title, route], key) => <Tab key={key} label={title} value={route}/>)}
						</Tabs>
						{
							this.state.loggedIn
								?
							<IconButton onClick={this.goToProfile}><AccountCircle fontSize='large' /></IconButton>
								:
							<FabButton variant='extended' onClick={this.handleLoginButton}>Login</FabButton>
						}
					</Toolbar>
				</AppBar>
				<LoginDialog open={this.state.loginOpen} onClose={this.closeLogin} />
			</>
		);
	}

}

export default withRouter(Navbar);
