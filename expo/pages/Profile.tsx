import bind from 'bind-decorator';
import { Formik, FormikProps } from 'formik';
import { number } from 'prop-types';
import * as React from 'react';
import { Alert, Picker, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import { alarmList } from '../common/Alarms';
import MyMICDS from '../common/MyMICDS';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import { components, PRIMARY, typography } from '../common/StyleGuide';
import { changeUserInfo, getUser, User } from '../common/User';
import { handleFieldChangeFactory } from '../common/Utils';
import CronchyUser from '../components/CronchyUser';
import Question from '../components/Question';

interface ProfileState {
}

interface SettingsFormValues {
	dataSharingSelection: number | null;
	alarmSelection: number| null;
}

const settingsFormInitialValues: SettingsFormValues = {
	dataSharingSelection: null,
	alarmSelection: null
};

export default class Profile extends React.Component<NavigationScreenProps, ProfileState> {

	private user!: User;

	static navigationOptions = createNavigationOptions('Profile');

	constructor(props: any) {
		super(props);
		this.state = { };
	}

	async componentDidMount() {
		const { user } = await getUser();

		if (user === null) {
			return this.logout();
		}

		this.user = user;

		settingsFormInitialValues.alarmSelection = this.user.alarmSelection || null;
		settingsFormInitialValues.dataSharingSelection = this.user.dataSharing || null;

		this.setState({});
	}

	@bind
	private logout() {
		MyMICDS.auth.logout().subscribe(() => {
			this.props.navigation.navigate('Auth');
		});
	}

	// @bind
	// private optChoose(index: number) {
	// 	this.setState({ dataSharingSelection: index });
	// }

	@bind
	private saveSettings(values: SettingsFormValues) {
		changeUserInfo({
			dataSharing: values.dataSharingSelection || 0,
			alarmSelection: values.alarmSelection || 0
		}).then(() => {
			Alert.alert(
				'Info',
				'Data sharing option updated!'
			);
		}).catch(err => {
			// Un-select on error, so the user knows to re-select
			this.setState({ dataSharingSelection: null });
			console.error(err);
		});
	}

	questionNames = [
		"Don't send teachers data at all",
		'Send data to teachers anonymously',
		'Send data to teachers as yourself'
	];

	// @bind
	// private async setAlarmMode(n: number) {
	// 		this.setState({
	// 			alarmSelection: n
	// 		});
	// 		// console.log(this.alarmList[n].file, this.alarmList[n].displayName);
	// 		// const soundObject = new Audio.Sound();
	// 		// try {
	// 		// 	await soundObject.loadAsync(this.alarmList[this.alarmSelection].file);
	// 		// 	console.log('swag', this.alarmList[n].file, this.alarmList[n].displayName);
	// 		// 	await this.alarmSound.setPositionAsync(0);
	// 		// 	await this.alarmSound.playAsync();
	// 		// } catch (error) {
	// 		// 	Alert.alert('sound buh', error.message());
	// 		// }
	// }

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
				<View style={styles.userInfo}>
					<Text style={typography.h3}>Logged in as: {MyMICDS.auth.snapshot ? MyMICDS.auth.snapshot.user : ''}</Text>
					<Button
						title='Logout'
						onPress={this.logout}
						buttonStyle={components.buttonStyle}
						titleStyle={components.buttonText}
					/>
				</View>

				<Text style={typography.h1}>Profile Settings</Text>

				<Formik
					initialValues={settingsFormInitialValues}
					onSubmit={this.saveSettings}
				>
					{props => (
						<View style={styles.container}>

							<Question
								question='How should we handle your timer data?'
								responses={this.questionNames}
								onSelectResponse={handleFieldChangeFactory<SettingsFormValues>(props, 'dataSharingSelection')}
								selectedIndex={props.values.dataSharingSelection}
							/>
							<View style={styles.alarmPicker}>
								<Text style={[typography.h3, styles.alarmPickerLabel]}>Alarm Preferences</Text>
								<Picker
									selectedValue={props.values.alarmSelection}
									onValueChange={handleFieldChangeFactory<SettingsFormValues>(props, 'alarmSelection')}
								>
									{alarmList.map((alarm, i) =>
										<Picker.Item
											key={i}
											label={alarm.displayName}
											value={i}
										/>
									)}
								</Picker>
							</View>

							<Button
								title='Save'
								onPress={props.handleSubmit as any}
								buttonStyle={components.buttonStyle}
								titleStyle={components.buttonText}
							/>
						</View>
					)}
				</Formik>
				{/* Logout button for debug */}
				<Button
					title='Logout'
					onPress={this.logout}
					buttonStyle={components.buttonStyle}
					titleStyle={components.buttonText}
				/>
			</SafeAreaView>
		);
	}

	// render() {
	// 	return (
	// 		<SafeAreaView style={styles.safeArea}>
	// 			<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
	// 			<CronchyUser user={MyMICDS.auth.snapshot ? MyMICDS.auth.snapshot.user : null} />
	// 		</SafeAreaView>
	// 	);
	// }

}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%'
	},
	container: {
		display: 'flex',
		justifyContent: 'center'
		// for some reason this messes with the Picker component
		// alignItems: 'center'
	},
	userInfo: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	question: {
		flex: 1
	},
	alarmPicker: {
		display: 'flex',
		justifyContent: 'center'
	},
	alarmPickerLabel: {
		alignSelf: 'center'
	}
});
