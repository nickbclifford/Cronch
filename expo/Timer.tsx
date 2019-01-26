import * as React from 'react';
import { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import MyMICDS, { CanvasEvent } from './MyMICDS';

import Hamburger from './Hamburger';

export default class Timer extends Component {

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
		drawerLabel: 'Timer',
		// drawerIcon: () => (
		// 	<FontAwesome name="bars" style={styles.menu} />
		// )
	};

	state: { assignments: CanvasEvent[] };

	constructor(props: any) {
		super(props);
		this.state = { assignments: [] };
	}

	_logout() {
		MyMICDS.auth.logout().subscribe(() => {
			(this.props as any).navigation.navigate('Auth');
		});
	}

	_getTodoAssignements() {
		MyMICDS.canvas.getEvents().subscribe(assignments => {
			this.setState({ assignments });
		});
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={(this.props as any).navigation.toggleDrawer} />
				<View style={styles.container}>
					<Text>This is the Timer!</Text>
					<Button title="Logout" onPress={() => this._logout()} />

					<FontAwesome
						name="bars"
						size={32}
						style={styles.menu}
						onPress={() => console.log('id tap that')}
					/>
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
