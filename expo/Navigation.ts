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
import createQuestionnaire from './QuestionnaireFactory';
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
)

// tslint:disable-next-line:variable-name
const Questionnaire = createQuestionnaire(
	'About',
	[
		{
			question: 'question 1',
			responses: ['response a', 'response b', 'response c', 'response d', 'response e']
		},
		{
			question: 'buh?',
			responses: ['buh.', '¿buh?', 'buh!', '...buh']
		},
		{
			question: 'foo',
			responses: ['bar', 'baz', 'quux']
		}
	]
);

const AppNavigator = createDrawerNavigator(
	{
		Timer: TimerNavigator,
		BattlePlan,
		Profile,
		About,
		Questionnaire
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
