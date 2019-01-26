import * as React from 'react';
import { Component } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import MyMICDS from './MyMICDS';

export default class Login extends Component {

	static navigationOptions = {
		header: null
	};

	state: { user: string; password: string; };

	constructor(props: any) {
		super(props);
		this.state = { user: '', password: '' };
	}

	_login() {
		MyMICDS.auth.login({
			user: this.state.user,
			password: this.state.password,
			remember: true,
			comment: 'Cronch Integration'
		}).subscribe(loginRes => {
			if (loginRes.success) {
				(this.props as any).navigation.navigate('App');
			} else {
				Alert.alert('Login Error', loginRes.message);
			}
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>Login to MyMICDS</Text>
				<TextInput
					value={this.state.user}
					onChangeText={user => this.setState({ user })}
					placeholder={'Username'}
					style={styles.input}
				/>
				<TextInput
					value={this.state.password}
					onChangeText={password => this.setState({ password })}
					placeholder={'Password'}
					style={styles.input}
				/>
				<Button title="Login" onPress={() => this._login()} />
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
	input: {}
});
