import { MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './common/styles';
import Navbar from './components/Navbar';
import About from './pages/About';
import BattlePlan from './pages/BattlePlan';
import Profile from './pages/Profile';
import Timer from './pages/Timer';

// tslint:disable-next-line:variable-name
const App = () => (
	<MuiThemeProvider theme={theme}>
		<BrowserRouter>
			<div>
				<Navbar />
				<Route exact={true} path='/' component={BattlePlan} />
				<Route path='/timer' component={Timer} />
				<Route path='/about' component={About} />
				<Route path='/profile' component={Profile} />
			</div>
		</BrowserRouter>
	</MuiThemeProvider>
);

export default App;
