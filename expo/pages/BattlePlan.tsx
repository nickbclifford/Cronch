import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';

import Hamburger from '../components/Hamburger';

interface BattlePlanState {
	assignments: CanvasEvent[];
}

export default class BattlePlan extends React.Component<NavigationScreenProps, BattlePlanState> {

	static navigationOptions = {
		header: null
	};

	constructor(props: any) {
		super(props);
		this.state = { assignments: [] };
	}

	componentDidMount() {
		MyMICDS.canvas.getEvents().subscribe(events => {
			let assignments = events.events;
			if (events.hasURL) {
				assignments = [];
			}
			this.setState({
				assignments: assignments
					.filter(a => a.end.valueOf() > Date.now())
					.sort((a, b) => a.end.unix() - b.end.unix())
			});
		});
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.container}>
					<Text>Battle Plan!</Text>
				</View>
			</SafeAreaView>
		);
	}

}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%'
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
