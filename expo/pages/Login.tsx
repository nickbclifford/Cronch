import bind from 'bind-decorator';
import { WebBrowser } from 'expo';
import { Formik } from 'formik';
import * as React from 'react';
import { Alert, ImageBackground, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';
import { combineLatest, throwError } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import Sentry from 'sentry-expo';

import MyMICDS from '../common/MyMICDS';
import withOnLoginContext, { WithOnLoginContextProps } from '../common/OnLoginContext';
import { getIfAnsweredQuestionnaire } from '../common/QuestionnaireResponse';
import questionnaires from '../common/Questionnaires';
import { components, NEUTRAL, nunito, typography } from '../common/StyleGuide';
import { getUser, registerUser } from '../common/User';
import { getMissingURLs } from '../common/Utils';

interface LoginForm {
	user: string;
	password: string;
}

const defaultFormValues: LoginForm = {
	user: '',
	password: ''
};

interface LoginState {
	loading: boolean;
}

class Login extends React.Component<NavigationScreenProps & WithOnLoginContextProps, LoginState> {

	static navigationOptions = {
		header: null
	};

	constructor(props: any) {
		super(props);
		this.state = { loading: false };
	}

	@bind
	private login({ user, password }: LoginForm) {
		this.setState({ loading: true });
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
				const { user: cronchUser } = await getUser();
				if (cronchUser === null) {
					return registerUser();
				}
			}),
			// Make sure that the user has all their URLs intact
			switchMap(() => combineLatest(
				MyMICDS.user.getInfo(),
				getIfAnsweredQuestionnaire(questionnaires.initial.id)
			)),
			// switchMap(() => MyMICDS.user.getInfo()),
			map(([mymicdsUser, answeredQuestionnaire]) => {
				return {
					missing: getMissingURLs(mymicdsUser),
					answeredQuestionnaire: answeredQuestionnaire.answered
				};
			}),
			first()
		).subscribe(
			({ missing, answeredQuestionnaire }) => {
				this.props.onLoginContext.loggedIn();
				this.setState({ loading: false });

				const checkUrls = missing.urls.length > 0;

				console.log('answered questionaire', answeredQuestionnaire, missing);

				if (answeredQuestionnaire) {
					if (checkUrls) {
						this.props.navigation.navigate('CheckUrls', missing);
					} else {
						this.props.navigation.navigate('App');
					}
				} else {
					console.log('navigate toe quesiton');
					this.props.navigation.navigate('InitialQuestionaire', {
						redirectAfter: checkUrls ? 'CheckUrls' : 'App',
						redirectAfterParams: missing
					});
				}
			},
			err => {
				this.setState({ loading: false });
				Sentry.captureException(err);
				Alert.alert('Login Error', err.message);
			}
		);
	}

	@bind
	async register() {
		try {
			await WebBrowser.openBrowserAsync('https://mymicds.net/register');
		} catch (err) {
			Sentry.captureException(err);
		}
	}

	render() {
		return (
			<Formik
				initialValues={defaultFormValues}
				onSubmit={this.login}
			>
				{props => (
					<ImageBackground source={require('../assets/mymicds/blur.jpg')} style={styles.container}>
						<StatusBar barStyle='dark-content' animated={true} />
						<View style={styles.colorOverlay} />
						{/*<Image source={require('../assets/mymicds/logo.png')} style={styles.logo} />*/}
						<Text style={[typography.h1, styles.title]}>Login to MyMICDS.net</Text>
						<View style={styles.usernameGroup}>
							<TextInput
								placeholder={'Username'}
								autoCapitalize='none'
								onChangeText={props.handleChange('user')}
								onBlur={props.handleBlur('user')}
								value={props.values.user}
								style={[components.textInput, styles.darkInput, styles.usernameInput]}
								placeholderTextColor={NEUTRAL[300]}
							/>
							<View style={styles.usernameLabelContainer}>
								<Text style={[typography.body, styles.usernameLabel]}>@micds.org</Text>
							</View>
						</View>
						<TextInput
							placeholder={'Password'}
							autoCapitalize='none'
							secureTextEntry={true}
							onChangeText={props.handleChange('password')}
							onBlur={props.handleBlur('password')}
							value={props.values.password}
							style={[components.textInput, styles.darkInput, styles.passwordInput]}
							placeholderTextColor={NEUTRAL[300]}
						/>
						<Button
							title='Login'
							loading={this.state.loading}
							containerStyle={styles.buttonContainer}
							buttonStyle={components.buttonStyle}
							titleStyle={components.buttonText}
							onPress={props.handleSubmit as any}
						/>
						<Text onPress={this.register} style={[typography.h3, styles.register]}>
							Not a member yet? <Text style={styles.registerUnderline}>Register</Text>
						</Text>
					</ImageBackground>
				)}
			</Formik>
		);
	}
}

export default withOnLoginContext(Login);

const styles = StyleSheet.create({
	container: {
		padding: 16,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	colorOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(255, 255, 255, 0.5)'
		// backgroundColor: 'rgba(0, 0, 0, 0.2)'
	},
	logo: {
		width: 80,
		height: 80,
		borderRadius: 40
	},
	title: {
		marginBottom: 36,
		// color: NEUTRAL[100]
		color: NEUTRAL[900]
	},
	darkInput: {
		backgroundColor: NEUTRAL[700],
		// backgroundColor: 'rgba(0, 0, 0, 0.6)',
		color: NEUTRAL[100]
	},
	usernameGroup: {
		width: '100%',
		maxWidth: 420,
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
	},
	buttonContainer: {
		// width: '100%'
	},
	register: {
		marginTop: 32,
		...StyleSheet.flatten(nunito.bold),
		// color: NEUTRAL[100]
		color: NEUTRAL[900]
	},
	registerUnderline: {
		textDecorationLine: 'underline'
	}
});
