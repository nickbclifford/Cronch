import bind from 'bind-decorator';
import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import createNavigationOptions from '../common/NavigationOptionsFactory';
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
			editButton: <Button title={this.state.editMode ? 'Done' : 'Edit'} onPress={this.toggleEditMode} />
		});
	}

	render() {
		return (
			<View style={styles.container}>
				{!this.state.editMode && (
					<DisplayAssignments
						navigation={this.props.navigation}
						assignments={this.state.assignments}
						headers={false}
						sort={false}
						reorder={false}
						containerStyle={styles.assignmentListContainer}
					/>
				)}
				{this.state.editMode && (
					<DisplayAssignments
						navigation={this.props.navigation}
						assignments={this.state.assignments}
						headers={false}
						sort={false}
						reorder={true}
						containerStyle={styles.assignmentListContainer}
					/>
				)}
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		height: '100%'
		// paddingBottom: 64
	},
	assignmentListContainer: {
		paddingTop: 16,
		marginBottom: 32
	}
});
