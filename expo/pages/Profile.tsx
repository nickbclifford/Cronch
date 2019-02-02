import bind from 'bind-decorator';
import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import MyMICDS from '../common/MyMICDS';

import Hamburger from '../components/Hamburger';

export default class Profile extends React.Component<NavigationScreenProps> {

	static navigationOptions = {
		header: null
	};

	@bind
	private logout() {
		MyMICDS.auth.logout().subscribe(() => {
			this.props.navigation.navigate('Auth');
		});
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.container}>
					<Text>My Profile!</Text>
					<Button title='Logout' onPress={this.logout} />
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
