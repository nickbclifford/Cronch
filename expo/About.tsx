import * as React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class About extends Component {

	static navigationOptions = {
		header: null
	};

	render() {
		return (
			<View style={styles.container}>
				<Text>This was created by cool people. Want to give feedback? Email support@mymicds.gov</Text>
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
