import * as React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import createNavigationOptions from '../common/NavigationOptionsFactory';
import { nunito, PRIMARY, typography } from '../common/StyleGuide';

export default class About extends React.Component<NavigationScreenProps> {

	static navigationOptions = createNavigationOptions('About');

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
				<View style={styles.container}>
					<Text style={[typography.body, styles.message]}>Bugs? Feature requests? Compliments? Roasts?</Text>
					<Text style={[typography.h1, nunito.bold, styles.message]}>Email hello@cronch.app</Text>
					<Text style={[typography.small]}>Version 1.0.1</Text>
				</View>
			</SafeAreaView>
		);
	}

}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%'
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	message: {
		textAlign: 'center'
	}
});
