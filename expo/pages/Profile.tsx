import bind from 'bind-decorator';
import * as React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import MyMICDS from '../common/MyMICDS';
import { changeUserInfo, getUserInfo } from '../common/User';
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

	async componentDidMount() {
		const { dataSharing } = await getUserInfo();
		this.setState({ selectedIndex: dataSharing });
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
		changeUserInfo({ dataSharing: index }).then(() => {
			Alert.alert(
				'Info',
				'Data sharing option updated!'
			);
		}).catch(err => {
			// Un-select on error, so the user knows to re-select
			this.setState({ selectedIndex: null });
			console.error(err);
		});
	}

	questionNames = [
		"Don't send teachers data at all",
		'Send data to teachers anonymously',
		'Send data to teachers as yourself'
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
