import * as React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Login extends Component {

	static navigationOptions = {
		header: null
	};

	render() {
		return (
			<View style={styles.container}>
				<Text>Login</Text>
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
