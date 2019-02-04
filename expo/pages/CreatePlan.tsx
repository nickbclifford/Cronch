import bind from 'bind-decorator';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import DisplayAssignments from '../components/DisplayAssignments';

interface CreatePlanState {
	assignments: CanvasEvent[];
}

export default class CreatePlan extends React.Component<NavigationScreenProps, CreatePlanState> {

	static navigationOptions = createNavigationOptions('Create Battle Plan', false);

	constructor(props: any) {
		super(props);
		this.state = { assignments: [] };
	}

	componentDidMount() {
		MyMICDS.canvas.getEvents().subscribe(events => {
			this.setState({
				assignments: events.hasURL ? events.events : []
			});
		});
	}

	@bind
	private navigateToAssignmentDetails(assignment: CanvasEvent) {
		this.props.navigation.navigate('AssignmentDetails', { assignment });
	}

	render() {
		return (
			<View style={styles.container}>
				<DisplayAssignments
					navigation={this.props.navigation}
					assignments={this.state.assignments}
					headers={true}
					paddingLeft={8}
					paddingRight={8}
					paddingBottom={64}
					onAssignmentClick={this.navigateToAssignmentDetails}
				/>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		height: '100%'
	}
});
