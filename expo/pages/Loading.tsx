import * as Font from 'expo-font';
import * as React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Image } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';
import { combineLatest } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import Sentry from 'sentry-expo';

import MyMICDS from '../common/MyMICDS';
import withOnLoginContext, { WithOnLoginContextProps } from '../common/OnLoginContext';
import { getIfAnsweredQuestionnaire } from '../common/QuestionnaireResponse';
import questionnaires from '../common/Questionnaires';
import { NEUTRAL } from '../common/StyleGuide';
import { getUser } from '../common/User';
import { getMissingURLs } from '../common/Utils';

export class Loading extends React.Component<NavigationScreenProps & WithOnLoginContextProps> {

	static navigationOptions = {
		header: null
	};

	componentDidMount() {
		this.listenToAuth();
	}

	/**
	 * Listen for changes to auth, then check whether user is authenticated and redirect to the appropriate views
	 */

	private listenToAuth() {
		combineLatest(
			MyMICDS.auth.$.pipe(
				filter(auth => auth !== undefined),
				first()
			),
			Font.loadAsync({
				'Nunito-Light': require('../assets/Nunito/Nunito-Light.ttf'),
				'Nunito-Regular': require('../assets/Nunito/Nunito-Regular.ttf'),
				'Nunito-Bold': require('../assets/Nunito/Nunito-Bold.ttf')
			})
		).subscribe(
			async ([mymicdsAuth]) => {
				if (mymicdsAuth === null) {
					this.props.navigation.navigate('Auth');
				} else {
					combineLatest(
						MyMICDS.user.$.pipe(
							filter(user => user !== undefined && user !== null),
							first()
						),
						getUser(),
						getIfAnsweredQuestionnaire(questionnaires.initial.id)
					).subscribe(
						([mymicdsUser, { user: cronchUser }, { answered }]) => {
							if (cronchUser === null) {
								MyMICDS.auth.logout().subscribe({
									error: err => {
										Sentry.captureException(err);
										Alert.alert('Logout Error', err.message);
									},
									complete: () => this.props.navigation.navigate('Auth')
								});
							} else {
								this.props.onLoginContext.loggedIn();
								const missing = getMissingURLs(mymicdsUser!);

								if (answered) {
									if (missing.hasRequired) {
										this.props.navigation.navigate('App');
									} else {
										this.props.navigation.navigate('CheckUrls', missing);
									}
								} else {
									this.props.navigation.navigate('InitialQuestionaire', {
										redirectAfter: missing.hasRequired ? 'App' : 'CheckUrls',
										redirectAfterParams: missing
									});
								}
							}
						},
						err => Sentry.captureException(err)
					);
				}
			},
			err => Sentry.captureException(err)
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<Image
					source={require('../assets/splash.png')}
					resizeMode='contain'
					style={styles.image}
				/>
			</View>
		);
	}

}

export default withOnLoginContext(Loading);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: NEUTRAL[100]
	},
	image: {
		width: '100%',
		height: '100%'
	}
});
