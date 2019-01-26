import * as React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MyMICDS from './MyMICDS';

export default class Loading extends Component {

	static navigationOptions = {
		header: null
	};

	componentDidMount() {
		this._listenToAuth();
	}

	/**
	 * Listen for changes to auth, then check whether user is authenticated and redirect to the appropriate views
	 */

	async _listenToAuth() {
		const subscription = MyMICDS.auth.$.subscribe(
			jwt => {
				if (jwt !== undefined) {
					(this.props as any).navigation.navigate(jwt ? 'App' : 'Auth');
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
	},
});
