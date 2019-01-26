import * as React from 'react';
import { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import MyMICDS from './MyMICDS';

import Hamburger from './Hamburger';

export default class Profile extends Component {

	static navigationOptions = {
		header: null
	};

	_logout() {
		MyMICDS.auth.logout().subscribe(() => {
			(this.props as any).navigation.navigate('Auth');
		});
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={(this.props as any).navigation.toggleDrawer} />
				<View style={styles.container}>
					<Text>My Profile!</Text>
					<Button title="Logout" onPress={() => this._logout()} />
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
});
