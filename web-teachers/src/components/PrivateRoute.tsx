import bind from 'bind-decorator';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import MyMICDS from '../common/MyMICDS';

// const PrivateRoute: React.SFC = ({ component: Component, ...rest }) => {
//
// 	@bind
// 	render
//
// 	if (MyMICDS.auth.isLoggedIn) {
// 		return (
// 			<Route path='/login' component={Component} {...rest} />
// 		);
// 	} else {
// 		return (
// 			<Redirect to='/login' />
// 		);
// 	}
//
// };

export default class PrivateRoute {

	@bind
	renderRoute(props) {
		if (MyMICDS.auth.isLoggedIn) {
			return (
				<Component {...props} />
			);
		} else {
			return (
				<Redirect to='/login' />
			);
		}
	}

	render() {
		return (
			<Route path='/login' component={} {...this.props} />
		);
	}

}
