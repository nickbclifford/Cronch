import { createStackNavigator, createAppContainer } from 'react-navigation';
import Timer from './Timer';
import About from './About';

const AppNavigator = createStackNavigator(
	{
		Timer: Timer,
		About: About
	},
	{
		initialRouteName: 'Timer'
	}
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
