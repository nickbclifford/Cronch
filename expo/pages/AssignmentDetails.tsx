import { CanvasEvent } from '@mymicds/sdk';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

interface NavigationParameters {
	assignment: CanvasEvent;
}

export default class AssignmentDetails extends React.Component<NavigationScreenProps<NavigationParameters>> {

	static navigationOptions = {
		header: null
	};

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<Text>{this.props.navigation.getParam('assignment').title}</Text>
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
