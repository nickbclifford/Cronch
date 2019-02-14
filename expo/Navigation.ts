import {
	createAppContainer,
	createBottomTabNavigator,
	createDrawerNavigator,
	createStackNavigator,
	createSwitchNavigator,
	StackNavigatorConfig
} from 'react-navigation';

import createNavigationOptions from './common/NavigationOptionsFactory';
import createQuestionnaire from './components/QuestionnaireFactory';

import About from './pages/About';
import Analytics from './pages/Analytics';
import AssignmentDetails from './pages/AssignmentDetails';
import BattlePlan from './pages/BattlePlan';
import CheckUrls from './pages/CheckUrls';
import CanvasAssignments from './pages/create-plan/CanvasAssignments';
import CustomAssignments from './pages/create-plan/CustomAssignments';
import Avatar from './pages/Avatar';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Timer from './pages/Timer';
import TimerModeSelectionModal from './pages/TimerModeSelectionModal';
import TimerModeSelection from './pages/TimerModeSelectionModal';
import Welcome from './pages/Welcome';

// tslint:disable:variable-name

function createSingleStackNavigator(Component: any, config?: StackNavigatorConfig) {
	return createStackNavigator({ Component }, config);
}

const AuthNavigator = createStackNavigator(
	{
		Welcome,
		Login,
		CheckUrls
	},
	{
		initialRouteName: 'Welcome'
	}
);

const AnalyticsNavigator = createStackNavigator(
	{
		Analytics
	},
	{
		initialRouteName: 'Analytics'
	}
);

const CreatePlan = createBottomTabNavigator(
	{
		CanvasAssignments,
		CustomAssignments
	},
	{
		initialRouteName: 'CanvasAssignments'
	}
);

// Use custom trasition in the future
const TimerNavigator = createStackNavigator(
	{
		BattlePlan,
		CreatePlan: {
			screen: CreatePlan,
			navigationOptions: createNavigationOptions('Create Plan', false)
		},
		AssignmentDetails,
		Timer: {
			screen: Timer
		},
		ModeSelection: TimerModeSelection
	},
	{
		initialRouteName: 'BattlePlan',
		// Timer header would look back if this is other values
		headerMode: 'screen'
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
		Avatar: createSingleStackNavigator(Avatar),
		Profile: createSingleStackNavigator(Profile),
		About: createSingleStackNavigator(About),
		Analytics: AnalyticsNavigator,
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
