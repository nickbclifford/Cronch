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
import TimerSelection from './TimerSelection';
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

// Use custom trasition in the future
const TimerNavigator = createStackNavigator(
	{
		TimerSelection,
		Timer
	},
	{
		initialRouteName: 'TimerSelection'
	}
);

const AppNavigator = createDrawerNavigator(
	{
		Timer: TimerNavigator,
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
