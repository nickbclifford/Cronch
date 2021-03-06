import bind from 'bind-decorator';
import { Permissions } from 'expo';
import * as React from 'react';
import {
	AsyncStorage,
	Dimensions,
	ImageStyle,
	StatusBar,
	StyleProp,
	StyleSheet,
	Text,
	View
} from 'react-native';
import { Button } from 'react-native-elements';
import Image from 'react-native-scalable-image';
import { NavigationScreenProps } from 'react-navigation';
import { Subscription } from 'rxjs';
import Sentry from 'sentry-expo';

import withAssignmentContext, { WithAssignmentContextProps } from '../common/AssignmentContext';
import createNavigationOptions, { menuStyle } from '../common/NavigationOptionsFactory';
import { components, NEUTRAL, PRIMARY, SUCCESS, typography } from '../common/StyleGuide';
import Task from '../common/Task';
import DisplayAssignments from '../components/DisplayAssignments';

interface BattlePlanProps extends NavigationScreenProps, WithAssignmentContextProps {
	getEditMode: () => boolean;
	toggleEditMode: () => void;
}

interface BattlePlanState {
	editMode: boolean;
	tasks: Task[];
}

class BattlePlan extends React.Component<BattlePlanProps, BattlePlanState> {

	static navigationOptions = createNavigationOptions<BattlePlanProps>(undefined, true, ({ navigation }) => {
		return {
			title: navigation.getParam('title'),
			headerRight: navigation.getParam('editButton')
		};
	});

	battlePlanSubscription?: Subscription;

	constructor(props: any) {
		super(props);
		this.state = { editMode: false, tasks: [] };
	}

	componentDidMount() {
		// const asked = this.props.navigation.getParam('askedNotifications');

		// console.log('asekd?', asked);
		//
		// if (asked === undefined) {
		// 	const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		// 	if (status !== 'granted') {
		// 		this.props.navigation.setParams({
		// 			askedNotifications: false
		// 		});
		// 	}
		// }
		this.updateHeader();
		this.battlePlanSubscription = this.props.assignmentContext.onAssignmentsChange.subscribe(
			tasks => {
				this.setState({ tasks });
			},
			err => Sentry.captureException(err)
		);
	}

	componentWillUnmount() {
		if (this.battlePlanSubscription) {
			this.battlePlanSubscription.unsubscribe();
		}
	}

	@bind
	private toggleEditMode() {
		this.setState({ editMode: !this.state.editMode });
		setTimeout(this.updateHeader);
	}

	@bind
	private updateHeader() {
		this.props.navigation.setParams({
			title: this.state.editMode ? 'Edit Battle Plan' : 'Battle Plan',
			editButton: (
				<Button
					title={this.state.editMode ? 'Done' : 'Edit'}
					type='clear'
					titleStyle={menuStyle}
					onPress={this.toggleEditMode}
				/>
			)
		});
	}

	@bind
	private navigateToCreatePlan() {
		this.props.navigation.navigate('CreatePlan');
	}

	@bind
	private async navigateToTimer(assignment: Task) {
		const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		console.log('battle plan notif status', status);
		const deniedNotifications = await AsyncStorage.getItem('permission_asked') === 'true';
		if (status === 'undetermined' && !deniedNotifications) {
			this.props.navigation.navigate('AllowNotifications', { redirectTo: 'BattlePlan' });
		} else {
			this.props.navigation.navigate('Timer', { assignment });
		}
	}

	@bind
	private onReorder(newAssignments: Task[]) {
		this.props.assignmentContext.updateAssignments(newAssignments);
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
				<View style={styles.addAssignmentsContainer}>
					<Button
						title='Add Assignments'
						raised={true}
						buttonStyle={components.buttonStyle}
						titleStyle={components.buttonText}
						onPress={this.navigateToCreatePlan}
					/>
					{this.state.tasks.length === 0 && (
						<View style={styles.guideContainer}>
							<Image
								source={require('../assets/apples/preset/hewwo-uweseres.png')}
								width={Dimensions.get('window').width * 0.65}
								style={styles.guideImage as StyleProp<ImageStyle>}
							/>
							<Text style={[typography.h3, styles.guideText]}>Add an Assignment{'\n'}to get started!</Text>
						</View>
					)}
				</View>
				{this.state.editMode && (
					<DisplayAssignments
						navigation={this.props.navigation}
						assignments={this.state.tasks}
						headers={false}
						sort={false}
						reorder={true}
						paddingTop={80}
						paddingRight={8}
						paddingLeft={8}
						paddingBottom={32}
						onReorder={this.onReorder}
					/>
				)}
				{!this.state.editMode && (
					<DisplayAssignments
						navigation={this.props.navigation}
						assignments={this.state.tasks}
						headers={false}
						sort={false}
						reorder={false}
						paddingTop={80}
						paddingRight={8}
						paddingLeft={8}
						paddingBottom={32}
						onAssignmentClick={this.navigateToTimer}
					/>
				)}
			</View>
		);
	}

}

export default withAssignmentContext(BattlePlan);

const styles = StyleSheet.create({
	container: {
		height: '100%'
	},
	addAssignmentsContainer: {
		width: '100%',
		position: 'absolute',
		zIndex: 1000,
		top: 16,
		display: 'flex',
		alignItems: 'center'
	},
	addAssignmentsButton: {
		backgroundColor: SUCCESS[500]
	},
	guideContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	guideImage: {
		marginTop: 128,
		marginBottom: 16,
		opacity: 0.65
	},
	guideText: {
		textAlign: 'center',
		color: NEUTRAL[500]
	}
});
