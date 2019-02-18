import {
	createAppContainer,
	createBottomTabNavigator,
	createDrawerNavigator,
	createStackNavigator,
	createSwitchNavigator,
	NavigationComponent,
	StackNavigatorConfig
} from 'react-navigation';

import createNavigationOptions from './common/NavigationOptionsFactory';
import questionnaires from './common/Questionnaires';
import createQuestionnaire from './components/QuestionnaireFactory';

import About from './pages/About';
import AllowNotifications from './pages/AllowNotifications';
import Analytics from './pages/Analytics';
import AssignmentDetails from './pages/AssignmentDetails';
import BattlePlan from './pages/BattlePlan';
import CheckUrls from './pages/CheckUrls';
import CanvasAssignments from './pages/create-plan/CanvasAssignments';
import CustomAssignments from './pages/create-plan/CustomAssignments';
import HomeworkTimer from './pages/HomeworkTimer';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TimerModeSelection from './pages/TimerModeSelectionModal';
import Welcome from './pages/Welcome';

// tslint:disable:variable-name

function createSingleStackNavigator(Component: NavigationComponent, config?: StackNavigatorConfig) {
	return createStackNavigator({ Component }, config);
}

const AuthNavigator = createStackNavigator(
	{
		Welcome,
		Login,
		InitialQuestionaire: createQuestionnaire(questionnaires.initial),
		CheckUrls
	},
	{
		initialRouteName: 'Welcome'
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

const AppNavigator = createDrawerNavigator(
	{
		Homework: TimerNavigator,
		Analytics: createSingleStackNavigator(Analytics),
		// Avatar: createSingleStackNavigator(Avatar),
		Profile: createSingleStackNavigator(Profile),
		About: createSingleStackNavigator(About)
	},
	{
		initialRouteName: 'Homework'
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
