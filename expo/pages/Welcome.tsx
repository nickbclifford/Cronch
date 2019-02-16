import bind from 'bind-decorator';
import * as React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';

import { components, typography } from '../common/StyleGuide';

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
				<StatusBar barStyle='dark-content' animated={true} />
				<Text style={[typography.h1, styles.greeting]}>Welcome to Cronch!</Text>
				<Button
					title='Get Started'
					buttonStyle={components.buttonStyle}
					titleStyle={components.buttonText}
					onPress={this.toLogin}
				/>
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
	greeting: {
		padding: 24
	}
});
