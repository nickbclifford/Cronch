import React from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom';

import MyMICDS from '../common/MyMICDS';

interface PrivateRouteProps extends RouteProps {
	component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

const PrivateRoute: React.StatelessComponent<PrivateRouteProps> = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			MyMICDS.auth.isLoggedIn ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: '/login',
						state: { from: props.location }
					}}
				/>
			)
		}
	/>
);

export default PrivateRoute;
