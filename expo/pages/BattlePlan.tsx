import bind from 'bind-decorator';
import * as React from 'react';
import { Button as NativeButton, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';
import AssignmentContext, { AssignmentContextType } from '../common/AssignmentContext';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import { NEUTRAL, SUCCESS } from '../common/StyleGuide';
import DisplayAssignments from '../components/DisplayAssignments';

interface BattlePlanProps extends NavigationScreenProps {
	getEditMode: () => boolean;
	toggleEditMode: () => void;
}

interface BattlePlanState {
	assignments: CanvasEvent[];
	editMode: boolean;
}

export default class BattlePlan extends React.Component<BattlePlanProps, BattlePlanState> {

	static navigationOptions = createNavigationOptions<BattlePlanProps>(null, true, ({ navigation }) => {
		return {
			title: navigation.getParam('title'),
			headerRight: navigation.getParam('editButton')
		};
	});

	static contextType = AssignmentContext;
	context!: AssignmentContextType;

	constructor(props: any) {
		super(props);
		this.state = { assignments: [], editMode: false };
	}

	componentDidMount() {
		this.updateHeader();
		setTimeout(() => {
			console.log('context', this.context);

			MyMICDS.canvas.getEvents().subscribe(events => {
				this.setState({
					assignments: events.hasURL ? events.events : []
				});
			});

			// this.setState({ assignments: this.context.assignments });
		});
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
				<NativeButton
					title={this.state.editMode ? 'Done' : 'Edit'}
					color={NEUTRAL[300]}
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
	private navigateToTimer(assignment: CanvasEvent) {
		this.props.navigation.navigate('Timer', { assignment });
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.addAssignmentsContainer}>
					<Button
						title='Add Assignments'
						raised={true}
						buttonStyle={styles.addAssignmentsButton}
						onPress={this.navigateToCreatePlan}
					/>
				</View>
				{this.state.editMode && (
					<DisplayAssignments
						navigation={this.props.navigation}
						assignments={this.state.assignments}
						headers={false}
						sort={false}
						reorder={true}
						paddingTop={72}
						paddingRight={8}
						paddingLeft={8}
						paddingBottom={32}
					/>
				)}
				{!this.state.editMode && (
					<DisplayAssignments
						navigation={this.props.navigation}
						assignments={this.state.assignments}
						headers={false}
						sort={false}
						reorder={false}
						paddingTop={72}
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
		flexDirection: 'row',
		justifyContent: 'center'
	},
	addAssignmentsButton: {
		backgroundColor: SUCCESS[500]
	}
});
