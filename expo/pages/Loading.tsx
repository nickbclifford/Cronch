import { Font } from 'expo';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { combineLatest } from 'rxjs';
import MyMICDS from '../common/MyMICDS';

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
		const subscription = combineLatest(
			MyMICDS.user.$,
			Font.loadAsync({
				'Nunito-Light': require('../assets/Nunito/Nunito-Light.ttf'),
				'Nunito-Regular': require('../assets/Nunito/Nunito-Regular.ttf'),
				'Nunito-Bold': require('../assets/Nunito/Nunito-Bold.ttf'),
				'Nunito-ExtraBold': require('../assets/Nunito/Nunito-Bold.ttf')
			})
		).subscribe(([user]) => {
			if (user !== undefined) {
				if (!user) {
					this.props.navigation.navigate('Auth');
				} else {
					if (user.canvasURL === null) {
						this.props.navigation.navigate('Auth');
					} else {
						this.props.navigation.navigate('CheckUrls');
					}
				}
				subscription.unsubscribe();
			}
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>Loading...</Text>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
