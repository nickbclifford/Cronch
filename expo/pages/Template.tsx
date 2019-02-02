import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import Hamburger from '../components/Hamburger';

export default class Template extends React.Component<NavigationScreenProps> {

	static navigationOptions = {
		header: null
	};

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
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