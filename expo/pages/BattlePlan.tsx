import bind from 'bind-decorator';
import * as React from 'react';
import { Button as NativeButton, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import { NEUTRAL, PRIMARY, SUCCESS } from '../common/StyleGuide';
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

	static navigationOptions = createNavigationOptions<BattlePlanProps>(null, ({ navigation }) => {
		return {
			title: navigation.getParam('title'),
			headerRight: navigation.getParam('editButton')
		};
	});

	// static navigationOptions = {
	// 	headerRight: <Button title='Edit' onPress={() => undefined} />
	// };

	// static navigationOptions = {
	// 	// header: null
	// 	title: 'Battle Plan'
	// 	headerLeft: ()
	// 	// headerRight: <Button title='Attack' onPress={BattlePlan.attack} />
	// };

	constructor(props: any) {
		super(props);
		this.state = { assignments: [], editMode: false };
	}

	componentDidMount() {
		this.updateHeader();

		MyMICDS.canvas.getEvents().subscribe(events => {
			this.setState({
				assignments: events.hasURL ? events.events : []
			});
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

	render() {
		if (this.state.editMode) {
			const topPaddingStyle = { paddingTop: 72 };
			return (
				<View style={styles.container}>
					<View style={styles.addAssignmentsContainer}>
						<Button
							title='Add Assignments'
							buttonStyle={styles.addAssignmentsButton}
							onPress={this.navigateToCreatePlan}
						/>
					</View>
					<DisplayAssignments
						navigation={this.props.navigation}
						assignments={this.state.assignments}
						headers={false}
						sort={false}
						reorder={true}
						containerStyle={[styles.assignmentListContainer, topPaddingStyle]}
						itemStyle={styles.assignmentListItem}
					/>
				</View>
			);
		} else {
			const topPaddingStyle = { paddingTop: 16 };
			return (
				<View style={styles.container}>
					<DisplayAssignments
						navigation={this.props.navigation}
						assignments={this.state.assignments}
						headers={false}
						sort={false}
						reorder={false}
						containerStyle={[styles.assignmentListContainer, topPaddingStyle]}
						itemStyle={styles.assignmentListItem}
					/>
				</View>
			);
		}
	}

}

const styles = StyleSheet.create({
	container: {
		height: '100%'
		// paddingBottom: 64
	},
	assignmentListContainer: {
		paddingBottom: 32
	},
	assignmentListItem: {
		marginLeft: 8,
		marginRight: 8
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
