import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import Loading from './Loading';

import Login from './Login';

import Timer from './Timer';
import About from './About';

const AuthNavigator = createStackNavigator({
	Login: Login
});

const AppNavigator = createStackNavigator(
	{
		Timer: Timer,
		About: About
	},
	{
		initialRouteName: 'Timer'
	}
);

const AppContainer = createAppContainer(createSwitchNavigator(
	{
		Loading: Loading,
		App: AppNavigator,
		Auth: AuthNavigator
	},
	{
		initialRouteName: 'Loading'
	}
));

export default AppContainer;
