import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

export default class AssignmentDetails extends React.Component<NavigationScreenProps> {

	static navigationOptions = {
		header: null
	};

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<Text>assignment details works!</Text>
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
