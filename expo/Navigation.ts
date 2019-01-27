import {
	createAppContainer,
	createDrawerNavigator,
	createStackNavigator,
	createSwitchNavigator
} from 'react-navigation';

import Loading from './Loading';

import Login from './Login';
import Welcome from './Welcome';

import About from './About';
import BattlePlan from './BattlePlan';
import Profile from './Profile';
import Timer from './Timer';

// tslint:disable:variable-name

const AuthNavigator = createStackNavigator(
	{
		Welcome,
		Login
	},
	{
		initialRouteName: 'Welcome'
	}
);

const AppNavigator = createDrawerNavigator(
	{
		Timer,
		BattlePlan,
		Profile,
		About
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
		Loading,
		App: AppNavigator,
		Auth: AuthNavigator
	},
	{
		initialRouteName: 'Loading'
	}
));

export default AppContainer;
