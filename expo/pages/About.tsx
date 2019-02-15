import * as React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import createNavigationOptions from '../common/NavigationOptionsFactory';
import { PRIMARY } from '../common/StyleGuide';

export default class About extends React.Component<NavigationScreenProps> {

	static navigationOptions = createNavigationOptions('About');

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
				<View style={styles.container}>
					<Text>This was created by Michel Gira, and Elsa Sjogren helped a litle bit. I love her so much because shes the best. Want to give Christian LeNoir money? Paypal pikachululz@gmail.com</Text>
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
