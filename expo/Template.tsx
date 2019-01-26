import * as React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Hamburger from './Hamburger';

export default class Template extends Component {

	static navigationOptions = {
		header: null
	};

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={(this.props as any).navigation.toggleDrawer} />
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
	},
});
