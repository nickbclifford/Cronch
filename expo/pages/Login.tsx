import bind from 'bind-decorator';
import * as React from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MyMICDS from '../common/MyMICDS';
import { switchMap } from 'rxjs/operators';
import { registerUser } from '../common/User';

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
		}).pipe(
			switchMap(({ success, message }) => {
				if (!success) {
					throw new Error(message);
				}

				return registerUser();
			})
		).subscribe(
			() => this.props.navigation.navigate('App'),
			err => Alert.alert('Login Error', err.message)
		);
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
