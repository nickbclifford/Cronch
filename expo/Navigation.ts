import { createDrawerNavigator, createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import Loading from './Loading';

import Welcome from './Welcome';
import Login from './Login';

import Timer from './Timer';
import BattlePlan from './BattlePlan';
import About from './About';

const AuthNavigator = createStackNavigator(
	{
		Welcome: Welcome,
		Login: Login
	},
	{
		initialRouteName: 'Welcome'
	}
);

const AppNavigator = createDrawerNavigator(
	{
		Timer: Timer,
		BattlePlan: BattlePlan,
		About: About
	},
	{
		initialRouteName: 'Timer'
	}
);

// const DrawerNavigator = createDrawerNavigator({
//
// });

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
