// import { FontAwesome } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';

export interface HamburgerProps {
	toggle(): void;
}

export default class Hamburger extends React.Component<HamburgerProps> {

	static navigationOptions = {
		header: null
	};

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View>
					<Icon
						name='bars'
						type='font-awesome'
						size={32}
						containerStyle={styles.menu}
						onPress={this.props.toggle}
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
