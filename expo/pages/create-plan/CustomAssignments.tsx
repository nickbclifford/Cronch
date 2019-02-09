import bind from 'bind-decorator';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { CanvasEvent } from '../../common/MyMICDS';
import createNavigationOptions from '../../common/NavigationOptionsFactory';

interface CustomAssignmentsState {
	assignments: CanvasEvent[];
}

export default class CustomAssignments extends React.Component<NavigationScreenProps, CustomAssignmentsState> {

	static navigationOptions = createNavigationOptions('Custom', false);

	constructor(props: any) {
		super(props);
		this.state = { assignments: [] };
	}

	@bind
	private navigateToAssignmentDetails(assignment: CanvasEvent) {
		this.props.navigation.navigate('AssignmentDetails', { assignment });
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>buh</Text>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		height: '100%'
	}
});
