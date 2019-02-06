import bind from 'bind-decorator';
import * as React from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import MyMICDS from '../common/MyMICDS';
import { getUser, registerUser } from '../common/User';

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
			switchMap(async ({ success, message }) => {
				if (!success) {
					return throwError(new Error(message));
				}

				// If you can successfully getUser, then we already know the user and they don't have to "register"
				try {
					await getUser();
				} catch {
					// Otherwise, if it fails, register them with us
					return registerUser();
				}
			}),
			// Make sure that the user has all their URLs intact
			switchMap(() => MyMICDS.user.getInfo()),
			switchMap(({ canvasURL, portalURLCalendar, portalURLClasses }) => {
				if (canvasURL === null) {
					return throwError(new Error('Missing Canvas URL on MyMICDS'));
				}
				if (portalURLCalendar === null) {
					return throwError(new Error('Missing Portal calendar URL on MyMICDS'));
				}
				if (portalURLClasses === null) {
					return throwError(new Error('Missing Portal classes URL on MyMICDS'));
				}

				console.log('done logging in');

				// It didn't like when I used the EMPTY constant for some reason
				return of({});
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
