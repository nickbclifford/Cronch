import * as React from 'react';
import { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default class Login extends Component {

	static navigationOptions = {
		header: null
	};

	render() {
		return (
			<View style={styles.container}>
				<Text>Welcome to Cronch!</Text>
				<Button title="Get Started" onPress={() => (this.props as any).navigation.navigate('Login')} />
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
