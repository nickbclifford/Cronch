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
import AllowNotifications from './pages/AllowNotifications';
import Analytics from './pages/Analytics';
import AssignmentDetails from './pages/AssignmentDetails';
import Avatar from './pages/Avatar';
import BattlePlan from './pages/BattlePlan';
import CheckUrls from './pages/CheckUrls';
import CanvasAssignments from './pages/create-plan/CanvasAssignments';
import CustomAssignments from './pages/create-plan/CustomAssignments';
import HomeworkTimer from './pages/HomeworkTimer';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TimerModeSelectionModal from './pages/TimerModeSelectionModal';
import TimerModeSelection from './pages/TimerModeSelectionModal';
import Welcome from './pages/Welcome';
import AvatarStore from './pages/AvatarStore';

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

const BattlePlanAndAllowNotifications = createStackNavigator(
	{
		BattlePlan,
		AllowNotifications
	},
	{
		mode: 'modal',
		navigationOptions: {
			header: null
		}
	}
);

const TimerNavigator = createStackNavigator(
	{
		BattlePlan: BattlePlanAndAllowNotifications,
		CreatePlan: {
			screen: CreatePlan,
			navigationOptions: createNavigationOptions('Create Plan', false)
		},
		AssignmentDetails,
		Timer: {
			screen: HomeworkTimer
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

const AvatarNavigator = createStackNavigator(
	{
		Avatar,
		AvatarStore
	},
	{
		initialRouteName: 'Avatar'
	}
);

const AppNavigator = createDrawerNavigator(
	{
		Timer: TimerNavigator,
		Avatar: AvatarNavigator,
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
