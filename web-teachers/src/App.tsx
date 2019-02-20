import bind from 'bind-decorator';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import ClassesList from './pages/ClassesList';
import Login from './pages/Login';

export default class App extends React.Component {

	@bind
	redirectToDefault() {
		return (
			<Redirect to='/classes-list' />
		);
	}

	render() {
		return (
			<Switch>
				<Route exact={true} path='/' render={this.redirectToDefault} />
				<Route path='/login' component={Login} />
				<Route path='/classes-list' component={ClassesList} />
				<Route render={this.redirectToDefault} />
			</Switch>
		);
	}
}
