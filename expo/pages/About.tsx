import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import createNavigationOptions from '../common/NavigationOptionsFactory';

export default class About extends React.Component<NavigationScreenProps> {

	static navigationOptions = createNavigationOptions('About');

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<Text>This was created by cool people. Want to give feedback? Email support@mymicds.gov</Text>
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
