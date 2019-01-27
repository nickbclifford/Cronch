import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MyMICDS from './MyMICDS';

export default class Loading extends React.Component<NavigationScreenProps> {

	static navigationOptions = {
		header: null
	};

	componentDidMount() {
		// noinspection JSIgnoredPromiseFromCall
		this.listenToAuth();
	}

	/**
	 * Listen for changes to auth, then check whether user is authenticated and redirect to the appropriate views
	 */

	private async listenToAuth() {
		const subscription = MyMICDS.auth.$.subscribe(
			jwt => {
				if (jwt !== undefined) {
					this.props.navigation.navigate(jwt ? 'App' : 'Auth');
					subscription.unsubscribe();
				}
			}
		);
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
