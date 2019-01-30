import bind from 'bind-decorator';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import Hamburger from './Hamburger';
import Question from './Question';

export default class About extends React.Component<NavigationScreenProps> {

	static navigationOptions = {
		header: null
	};

	private responses = ['response 1', 'response 2', 'response 3', 'response 4'];

	@bind
	private onQuestionResponse(index: number) {
		console.log(`selected response "${this.responses[index]}" (index ${index})`);
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.container}>
					<Text>This was created by cool people. Want to give feedback? Email support@mymicds.gov</Text>
					<Question question='Test Question' responses={this.responses} onSelectResponse={this.onQuestionResponse} />
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
