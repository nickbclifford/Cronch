import bind from 'bind-decorator';
// import { Notifications, Permissions } from 'expo';
import * as React from 'react';
import { AsyncStorage, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import { async } from 'rxjs/internal/scheduler/async';
import { Expression, Skin } from '../common/AvatarTypes';
import { getNotificationPermissions, submitNotificationToken } from '../common/NotificationToken';
import { components, NEUTRAL, nunito, PRIMARY, typography } from '../common/StyleGuide';
import Cronchy from '../components/Cronchy';

interface AllowNotificationsState {
	asking: boolean;
}

export default class AllowNotifications extends React.Component<NavigationScreenProps, AllowNotificationsState> {

	static navigationOptions = {
		header: null
	};

	private permissionSpamInterval: any;

	constructor(props: any) {
		super(props);
		this.state = { asking: false };
	}

	// @bind
	// async askForPermission() {
	// 	this.setState({ asking: true });
	// 	console.log('asked');
	// 	const status = await getNotificationPermissions();
	// 	if (status !== 'granted') {
	// 		clearInterval(this.permissionSpamInterval);
	// 		await AsyncStorage.setItem('deniedNotifications', 'true');
	// 		return this.continue();
	// 	}
	// 	const token = await Notifications.getExpoPushTokenAsync();
	// 	await submitNotificationToken(token);
	// 	this.continue();
	// }

	// @bind
	// askForPermissionSpam() {
	// 	this.askForPermission();
	// 	this.permissionSpamInterval = setInterval(() => {
	// 		this.askForPermission();
	// 	}, 500);
	// }

	@bind
	continue() {
		AsyncStorage.setItem('permission_asked', 'true');
		this.setState({ asking: false });
		this.props.navigation.navigate(
			this.props.navigation.getParam('redirectTo'),
			this.props.navigation.getParam('redirectParams')
		);
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<StatusBar barStyle='dark-content' backgroundColor={PRIMARY[500]} animated={true} />
				<View style={styles.container}>
					<Text style={[typography.h2, nunito.bold, styles.header]}>
						Hey, we need you to enable notifications!
					</Text>
					<Text style={[typography.body, styles.moreInfo]}>
						That way, we can alert you when it's time to start/end breaks and keep you up-to-date on the latest features.
					</Text>
					<Cronchy
						skin={Skin.GreenPlain}
						expression={Expression.Oh}
						style={styles.apple}
					/>
					<Button
						title='Enable Notifications'
						loading={this.state.asking}
						// onPress={this.askForPermissionSpam}
						containerStyle={styles.buttonContainer}
						buttonStyle={components.buttonStyle}
						titleStyle={components.buttonText}
					/>
					<Text onPress={this.continue} style={[typography.body, styles.skip]}>No Thanks</Text>
				</View>
			</SafeAreaView>
		);
	}

}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%',
		backgroundColor: NEUTRAL[100]
	},
	container: {
		height: '100%',
		padding: 32,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	header: {
		flexGrow: 0,
		alignSelf: 'flex-start',
		marginTop: 16,
		marginBottom: 16,
		color: NEUTRAL[900]
	},
	moreInfo: {
		flexGrow: 0,
		alignSelf: 'flex-start',
		color: NEUTRAL[700]
	},
	apple: {
		flexGrow: 1,
		width: '100%',
		marginTop: 16,
		marginBottom: 16
	},
	buttonContainer: {
		flexGrow: 0
	},
	skip: {
		marginTop: 16,
		textDecorationLine: 'underline',
		color: NEUTRAL[500]
	}
});
