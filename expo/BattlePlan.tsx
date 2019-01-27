import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import Hamburger from './Hamburger';

export default class BattlePlan extends React.Component<NavigationScreenProps> {

	static navigationOptions = {
		header: null
	};

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.container}>
					<Text>Battle Plan!</Text>
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
