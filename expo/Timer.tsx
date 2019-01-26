import * as React from 'react';
import { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import MyMICDS from './MyMICDS';

export default class Timer extends Component {

	static navigationOptions = {
		// title: 'Home',
		// headerStyle: {
		// 	backgroundColor: '#f4511e',
		// },
		// headerTintColor: '#fff',
		// headerTitleStyle: {
		// 	fontWeight: 'bold',
		// }
		header: null
	};

	_logout() {
		MyMICDS.auth.logout().subscribe(() => {
			(this.props as any).navigation.navigate('Auth');
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>This is the Timer!</Text>
				<Button title="Logout" onPress={() => this._logout()} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
});
