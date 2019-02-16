import bind from 'bind-decorator';
import * as React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';

import MyMICDS from '../../common/MyMICDS';
import createNavigationOptions from '../../common/NavigationOptionsFactory';
import { PRIMARY } from '../../common/StyleGuide';
import Task from '../../common/Task';
import DisplayAssignments from '../../components/DisplayAssignments';

interface CanvasAssignmentsState {
	assignments: Task[];
}

export default class CanvasAssignments extends React.Component<NavigationScreenProps, CanvasAssignmentsState> {

	static navigationOptions = createNavigationOptions('Canvas', false, () => {
		return {
			tabBarIcon: ({ tintColor }: { tintColor: string }) => {
				return (
					<Icon
						name='graduation-cap'
						type='font-awesome'
						color={tintColor}
					/>
				);
			}
		};
	});

	constructor(props: any) {
		super(props);
		this.state = { assignments: [] };
	}

	componentDidMount() {
		MyMICDS.canvas.getEvents().subscribe(({ hasURL, events }) => {
			this.setState({
				assignments: hasURL ? events : []
			});
		});
	}

	@bind
	private navigateToAssignmentDetails(assignment: Task) {
		this.props.navigation.navigate('AssignmentDetails', { assignment, neuter: false });
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
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
