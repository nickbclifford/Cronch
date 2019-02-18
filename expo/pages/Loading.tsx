import { Font } from 'expo';
import * as React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Image } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';
import { combineLatest } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import MyMICDS from '../common/MyMICDS';
import { NEUTRAL } from '../common/StyleGuide';
import { getUser } from '../common/User';
import { getMissingURLs } from '../common/Utils';

export default class Loading extends React.Component<NavigationScreenProps> {

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
				// 'Nunito-ExtraBold': require('../assets/Nunito/Nunito-ExtraBold.ttf'),
				// 'Nunito-Black': require('../assets/Nunito/Nunito-Black.ttf')
			})
		).subscribe(async ([mymicdsAuth]) => {
			if (mymicdsAuth === null) {
				this.props.navigation.navigate('Auth');
			} else {
				combineLatest(
					MyMICDS.user.$.pipe(
						filter(user => user !== undefined && user !== null),
						first()
					),
					getUser()
				).subscribe(
					([mymicdsUser, { user: cronchUser }]) => {
						if (cronchUser === null) {
							MyMICDS.auth.logout().subscribe({
								error: err => Alert.alert('Logout Error', err.message),
								complete: () => this.props.navigation.navigate('Auth')
							});
						} else {
							const missing = getMissingURLs(mymicdsUser!);
							if (missing.hasRequired) {
								this.props.navigation.navigate('App');
							} else {
								this.props.navigation.navigate('CheckUrls', missing);
							}
						}
					}
				);
			}
		});
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
