import {
	createAppContainer,
	createDrawerNavigator,
	createStackNavigator,
	createSwitchNavigator
} from 'react-navigation';

import createQuestionnaire from './components/QuestionnaireFactory';

import About from './pages/About';
import AssignmentDetails from './pages/AssignmentDetails';
import BattlePlan from './pages/BattlePlan';
import CreatePlan from './pages/CreatePlan';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Timer from './pages/Timer';
import Welcome from './pages/Welcome';
import TimerModeSelectionModal from './pages/TimerModeSelectionModal';

// tslint:disable:variable-name

function createSingleStackNavigator(Component: any) {
	return createStackNavigator({ Component });
}

const AuthNavigator = createStackNavigator(
	{
		Welcome,
		Login
	},
	{
		initialRouteName: 'Welcome'
	}
);

const TimerAndModal = createStackNavigator(
	{
		Timer,
		ModeSelection: TimerModeSelectionModal
	},
	{
		mode: 'modal',
		headerMode: 'none'
	}
)

// Use custom trasition in the future
const TimerNavigator = createStackNavigator(
	{
		BattlePlan,
		CreatePlan,
		AssignmentDetails,
		Timer: TimerAndModal
	},
	{
		initialRouteName: 'BattlePlan'
	}
);

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
		Profile: createSingleStackNavigator(Profile),
		About: createSingleStackNavigator(About),
		Questionnaire
	},
	{
		initialRouteName: 'Timer'
	}
);

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
