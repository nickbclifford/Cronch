import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import MyMICDS, { CanvasEvent } from './MyMICDS';

import Hamburger from './Hamburger';

export default class Timer extends React.Component<NavigationScreenProps> {

	static navigationOptions = {
		title: 'Home',
		// headerStyle: {
		// 	backgroundColor: '#f4511e',
		// },
		// headerTintColor: '#fff',
		// headerTitleStyle: {
		// 	fontWeight: 'bold',
		// }
		// header: null
		drawerLabel: 'Timer'
		// drawerIcon: () => (
		// 	<FontAwesome name="bars" style={styles.menu} />
		// )
	};

	state: { assignments: CanvasEvent[] };

	constructor(props: any) {
		super(props);
		this.state = { assignments: [] };
	}

	private getTodoAssignments() {
		MyMICDS.canvas.getEvents().subscribe(assignments => {
			this.setState({ assignments });
		});
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.container}>
					<Text>This is the Timer!</Text>
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
	},
	menu: {
		// position: 'absolute',
		// top: 16,
		// left: 16
	}
});
