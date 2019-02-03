import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import DisplayAssignments from '../components/DisplayAssignments';

import Hamburger from '../components/Hamburger';

interface CreatePlanState {
	assignments: CanvasEvent[];
}

export default class CreatePlan extends React.Component<NavigationScreenProps, CreatePlanState> {

	static navigationOptions = {
		header: null
		// title: 'Battle Plan'
		// headerRight: <Button title='Attack' onPress={BattlePlan.attack} />
	};

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

	render() {
		return (
			<View style={styles.container}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<DisplayAssignments
					navigation={this.props.navigation}
					assignments={this.state.assignments}
					headers={true}
				/>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		paddingBottom: 64
	}
});
