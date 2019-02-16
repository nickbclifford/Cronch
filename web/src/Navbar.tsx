import { Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import bind from 'bind-decorator';
import React, { Component } from 'react';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import './Navbar.scss';
import { Button } from './styles';

const tabNameRoutes = [
	['Battle Plan', '/'],
	['Timer', '/timer'],
	['Profile', '/profile'],
	['About', '/about']
];

class Navbar extends Component<RouteComponentProps, { value: string }> {

	state = {
		value: '/'
	};

	// noinspection JSUnusedLocalSymbols
	@bind
	private handleTabChange(event: any, value: string) {
		this.props.history.push(value);
		this.setState({ value });
	}

	render() {
		return (
			<AppBar position='static'>
				<Toolbar className='Toolbar'>
					<Typography color='inherit' variant='h5'>Cronch</Typography>
					<Tabs className='Tabs' centered={true} value={this.state.value} onChange={this.handleTabChange}>
						{tabNameRoutes.map(([title, route], key) => <Tab key={key} label={title} value={route}/>)}
					</Tabs>
					<Button>Login</Button>
				</Toolbar>
			</AppBar>
		);
	}

}

export default withRouter(Navbar);
