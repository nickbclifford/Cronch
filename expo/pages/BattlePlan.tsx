import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import DisplayAssignments from '../components/DisplayAssignments';

import Hamburger from '../components/Hamburger';

interface BattlePlanState {
	assignments: CanvasEvent[];
}

export default class BattlePlan extends React.Component<NavigationScreenProps, BattlePlanState> {

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
				<DisplayAssignments navigation={this.props.navigation} assignments={this.state.assignments} />
			</View>
		);
	}

}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%'
	},
	container: {
		paddingBottom: 64
	}
});
