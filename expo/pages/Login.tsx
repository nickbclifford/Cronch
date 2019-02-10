import bind from 'bind-decorator';
import { Formik } from 'formik';
import * as React from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';
import { of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import MyMICDS from '../common/MyMICDS';
import { components, NEUTRAL, textInputPlaceholderColor, typography } from '../common/StyleGuide';
import { getUser, registerUser } from '../common/User';
import { oxfordCommaList } from '../common/Utils';

export interface LoginForm {
	user: string;
	password: string;
}

const defaultFormValues: LoginForm = {
	user: '',
	password: ''
};

export default class Login extends React.Component<NavigationScreenProps> {

	static navigationOptions = {
		header: null
	};

	@bind
	private login({ user, password }: LoginForm) {
		MyMICDS.auth.login({
			user,
			password,
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
				const missingURLs: string[] = [];
				if (canvasURL === null)         { missingURLs.push('Canvas');          }
				if (portalURLCalendar === null) { missingURLs.push('Portal calendar'); }
				if (portalURLClasses === null)  { missingURLs.push('Portal classes');  }

				if (missingURLs.length > 0) {
					return throwError(new Error(
						`Looks like you haven't saved your ${oxfordCommaList(missingURLs)} ` +
						`feed${missingURLs.length === 1 ? '' : 's'} on MyMICDS. Please go to your settings on MyMICDS.net ` +
						`and configure ${missingURLs.length === 1 ? 'it' : 'them'} in order to use Cronch.`
					));
				}

				// It didn't like when I used the EMPTY constant for some reason
				return of({});
			})
		).subscribe(
			() => this.props.navigation.navigate('App'),
			err => Alert.alert('Login Error', err.message)
		);
	}

	render() {
		return (
			<Formik
				initialValues={defaultFormValues}
				onSubmit={this.login}
			>
				{props => (
					<View style={styles.container}>
						<Text style={[typography.h1, styles.title]}>Login to MyMICDS</Text>
						<View style={styles.usernameGroup}>
							<TextInput
								placeholder={'Username'}
								onChangeText={props.handleChange('user')}
								onBlur={props.handleBlur('user')}
								value={props.values.user}
								style={[components.textInput, styles.usernameInput]}
								placeholderTextColor={textInputPlaceholderColor}
							/>
							<View style={styles.usernameLabelContainer}>
								<Text style={[typography.body, styles.usernameLabel]}>@micds.org</Text>
							</View>
						</View>
						<TextInput
							placeholder={'Password'}
							secureTextEntry={true}
							onChangeText={props.handleChange('password')}
							onBlur={props.handleBlur('password')}
							value={props.values.password}
							style={[components.textInput, styles.passwordInput]}
							placeholderTextColor={textInputPlaceholderColor}
						/>
						<Button
							title='Login'
							buttonStyle={components.buttonStyle}
							titleStyle={components.buttonText}
							onPress={props.handleSubmit as any}
						/>
					</View>
				)}
			</Formik>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		marginBottom: 36
	},
	usernameGroup: {
		width: '100%',
		marginBottom: 8,
		display: 'flex',
		flexDirection: 'row'
	},
	usernameInput: {
		flexGrow: 1,
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0
	},
	usernameLabelContainer: {
		flexGrow: 0,
		padding: 8,
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: NEUTRAL[500],
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5
	},
	usernameLabel: {
		textAlignVertical: 'center',
		color: NEUTRAL[300]
	},
	passwordInput: {
		width: '100%',
		marginBottom: 24
	}
});
