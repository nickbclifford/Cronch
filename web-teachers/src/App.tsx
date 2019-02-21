import bind from 'bind-decorator';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filter, first } from 'rxjs/operators';

import MyMICDS from './common/MyMICDS';
import PrivateRoute from './components/PrivateRoute';

import ClassesList from './pages/ClassesList';
import Login from './pages/Login';
import Logout from './pages/Logout';

interface AppState {
	loading: boolean;
}

export default class App extends React.Component<any, AppState> {

	constructor(props: any) {
		super(props);
		this.state = { loading: true };
	}

	componentDidMount() {
		MyMICDS.errors.subscribe(err => {
			alert(`MyMICDS Error ${err.message}`);
		});

		MyMICDS.auth.$.pipe(
			filter(auth => auth !== undefined),
			first()
		).subscribe(() => this.setState({ loading: false }));
	}

	@bind
	redirectToDefault() {
		return (
			<Redirect to='/classes-list' />
		);
	}

	render() {
		if (this.state.loading) {
			return (
				<p>Loading...</p>
			);
		} else {
			return (
				<Switch>
					<Route exact={true} path='/' render={this.redirectToDefault} />
					<Route path='/login' component={Login} />
					<Route path='/logout' component={Logout} />
					<PrivateRoute path='/classes-list' component={ClassesList} />
					<Route render={this.redirectToDefault} />
				</Switch>
			);
		}
	}
}
