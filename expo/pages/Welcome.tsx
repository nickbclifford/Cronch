import bind from 'bind-decorator';
import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

export default class Welcome extends React.Component<NavigationScreenProps> {

	static navigationOptions = {
		header: null
	};

	@bind
	private toLogin() {
		this.props.navigation.navigate('Login');
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>Welcome to Cronch!</Text>
				<Button title='Get Started' onPress={this.toLogin} />
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
