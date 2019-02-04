import bind from 'bind-decorator';
import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import MyMICDS from '../common/MyMICDS';
import Question from '../components/Question';

import Hamburger from '../components/Hamburger';

interface ProfileState {
	selectedIndex: number | null;
}

export default class Profile extends React.Component<NavigationScreenProps, ProfileState> {

	static navigationOptions = {
		header: null,
		title: 'Profile'
	};

	constructor(props: any) {
		super(props);

		this.state = {
			selectedIndex: null
		};
	}

	@bind
	private logout() {
		MyMICDS.auth.logout().subscribe(() => {
			this.props.navigation.navigate('Auth');
		});
	}

	@bind
	private optChoose(index: number) {
		this.setState({ selectedIndex: index });
	}

	questionNames = [
		'Send data to teachers',
		'Send data to teachers anonymously',
		"Don't send teachers data at all"
	];

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.container}>
					<Question
						question='How should we handle your timer data?'
						responses={this.questionNames}
						onSelectResponse={this.optChoose}
						selectedIndex={this.state.selectedIndex}
					/>
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
