import * as React from 'react';
import { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';

export default class Hamburger extends Component {

	static navigationOptions = {
		header: null
	};

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View>
					<FontAwesome
						name="bars"
						size={32}
						style={styles.menu}
						onPress={() => (this.props as any).toggle()}
					/>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	safeArea: {
		width: 16 + 32,
		height: 16 + 32
	},
	menu: {
		position: 'absolute',
		top: 16,
		left: 16,
		zIndex: 1000
	}
});
