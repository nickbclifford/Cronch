import bind from 'bind-decorator';
import * as React from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MyMICDS from './MyMICDS';

export interface LoginState {
	user: string;
	password: string;
}

export default class Login extends React.Component<NavigationScreenProps, LoginState> {

	static navigationOptions = {
		header: null
	};

	constructor(props: NavigationScreenProps) {
		super(props);
		this.state = { user: '', password: '' };
	}

	@bind
	private login() {
		MyMICDS.auth.login({
			user: this.state.user,
			password: this.state.password,
			remember: true,
			comment: 'Cronch Integration'
		}).subscribe(loginRes => {
			if (loginRes.success) {
				this.props.navigation.navigate('App');
			} else {
				Alert.alert('Login Error', loginRes.message);
			}
		});
	}

	@bind
	private setUser(user: string) {
		this.setState({ user });
	}

	@bind
	private setPassword(password: string) {
		this.setState({ password });
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>Login to MyMICDS</Text>
				<TextInput
					value={this.state.user}
					onChangeText={this.setUser}
					placeholder={'Username'}
					style={styles.input}
				/>
				<TextInput
					value={this.state.password}
					onChangeText={this.setPassword}
					placeholder={'Password'}
					secureTextEntry={true}
					style={styles.input}
				/>
				<Button title='Login' onPress={this.login} />
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
