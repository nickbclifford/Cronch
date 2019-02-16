import { MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import About from './About';
import BattlePlan from './BattlePlan';
import Navbar from './Navbar';
import Profile from './Profile';
import { theme } from './styles';
import Timer from './Timer';

// tslint:disable-next-line:variable-name
const App = () => (
	<MuiThemeProvider theme={theme}>
		<BrowserRouter>
			<div>
				<Navbar />
				<Route exact={true} path='/' component={BattlePlan} />
				<Route path='/timer' component={Timer} />
				<Route path='/profile' component={Profile} />
				<Route path='/about' component={About} />
			</div>
		</BrowserRouter>
	</MuiThemeProvider>
);

export default App;
