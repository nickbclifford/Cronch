import * as React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import createNavigationOptions from '../common/NavigationOptionsFactory';
import { PRIMARY } from '../common/StyleGuide';

export default class Template extends React.Component<NavigationScreenProps> {

	static navigationOptions = createNavigationOptions('Completed Assignments');

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
				<View style={styles.container}>
					<Text>Component Works!</Text>
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
	}
});
