import * as React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Loading extends Component {

	static navigationOptions = {
		header: null
	};

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
