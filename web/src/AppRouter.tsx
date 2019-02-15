import React from 'react';
import { Route } from 'react-router';
import App from './App';
import OtherPage from './OtherPage';
import { BrowserRouter } from 'react-router-dom';

const AppRouter = () => (
	<BrowserRouter>
		<div>
			<Route exact path='/' component={App} />
			<Route path='/other-page' component={OtherPage} />
		</div>
	</BrowserRouter>
);

export default AppRouter;
