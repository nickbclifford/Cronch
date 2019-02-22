import bind from 'bind-decorator';
import { Formik, FormikActions, FormikProps } from 'formik';
import { number } from 'prop-types';
import * as React from 'react';
import { Alert, Picker, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button, CheckBox, Divider } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import Sentry from 'sentry-expo';

import { alarmList } from '../common/Alarms';
import MyMICDS from '../common/MyMICDS';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import { components, NEUTRAL, PRIMARY, typography } from '../common/StyleGuide';
import { nunito } from '../common/StyleGuide';
import { changeUserInfo, getUser, User } from '../common/User';
import { handleFieldChangeFactory } from '../common/Utils';
import CronchyUser from '../components/CronchyUser';
import Question from '../components/Question';

// TODO: What's the deal with this component's state?
interface ProfileState {
	submittingSettings: boolean;
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
		this.state = {
			submittingSettings: false
		};

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
		MyMICDS.auth.logout().subscribe(
			() => this.props.navigation.navigate('Auth'),
			err => Sentry.captureException(err)
		);
	}

	// @bind
	// private optChoose(index: number) {
	// 	this.setState({ dataSharingSelection: index });
	// }

	@bind
	private saveSettings(values: SettingsFormValues, actions: FormikActions<SettingsFormValues>) {
		this.setState({
			submittingSettings: true
		});
		changeUserInfo({
			dataSharing: values.dataSharingSelection || 0,
			alarmSelection: values.alarmSelection || 0
		}).then(() => {
			this.setState({
				submittingSettings: false
			});
			// Alert.alert(
			// 	'Info',
			// 	'Settings updated!'
			// );
		}).catch(err => {
			// Un-select on error, so the user knows to re-select
			this.setState({
				submittingSettings: false
			});
			actions.resetForm();
			Sentry.captureException(err);
			console.error(err);
		});
	}

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

	// render() {
	// 	return (
	// 		<SafeAreaView style={styles.safeArea}>
	// 			<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
	// 			<View style={styles.userInfo}>
	// 				<Text style={typography.h3}>Logged in as: {MyMICDS.auth.snapshot ? MyMICDS.auth.snapshot.user : ''}</Text>
	// 				<Button
	// 					title='Logout'
	// 					onPress={this.logout}
	// 					buttonStyle={components.buttonStyle}
	// 					titleStyle={components.buttonText}
	// 				/>
	// 			</View>
	//
	// 			<Text style={typography.h1}>Profile Settings</Text>
	//
	// 			<Formik
	// 				initialValues={settingsFormInitialValues}
	// 				onSubmit={this.saveSettings}
	// 			>
	// 				{props => (
	// 					<View style={styles.container}>
	//
	// 						<Question
	// 							question='How should we handle your timer data?'
	// 							responses={this.questionNames}
	// 							onSelectResponse={handleFieldChangeFactory<SettingsFormValues>(props, 'dataSharingSelection')}
	// 							selectedIndex={props.values.dataSharingSelection}
	// 						/>
	// 						<View style={styles.alarmPicker}>
	// 							<Text style={[typography.h3, styles.alarmPickerLabel]}>Alarm Preferences</Text>
	// 							<Picker
	// 								selectedValue={props.values.alarmSelection}
	// 								onValueChange={handleFieldChangeFactory<SettingsFormValues>(props, 'alarmSelection')}
	// 							>
	// 								{alarmList.map((alarm, i) =>
	// 									<Picker.Item
	// 										key={i}
	// 										label={alarm.displayName}
	// 										value={i}
	// 									/>
	// 								)}
	// 							</Picker>
	// 						</View>
	//
	// 						<Button
	// 							title='Save'
	// 							onPress={props.handleSubmit as any}
	// 							buttonStyle={components.buttonStyle}
	// 							titleStyle={components.buttonText}
	// 						/>
	// 					</View>
	// 				)}
	// 			</Formik>
	// 			{/* Logout button for debug */}
	// 			<Button
	// 				title='Logout'
	// 				onPress={this.logout}
	// 				buttonStyle={components.buttonStyle}
	// 				titleStyle={components.buttonText}
	// 			/>
	// 		</SafeAreaView>
	// 	);
	// }

	render() {
		const dataOptions = [
			"Don't send teachers data at all",
			'Send data to teachers anonymously',
			'Send data to teachers as yourself'
		];

		return (
			<SafeAreaView style={styles.safeArea}>
				<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
				<ScrollView contentContainerStyle={styles.mainContainer}>
					<View style={styles.user}>
						<CronchyUser style={styles.avatar} user={MyMICDS.auth.snapshot ? MyMICDS.auth.snapshot.user : null} />
						<View style={styles.loginText}>
								<Text style={[typography.body, styles.loggedInAs]}>Logged in as</Text>
								<Text style={[typography.h0, styles.loggedInUser]} adjustsFontSizeToFit={true} numberOfLines={1}>
									{MyMICDS.auth.snapshot ? MyMICDS.auth.snapshot.user : ''}
								</Text>
						</View>
					</View>
					<View style={styles.logoutContainer}>
						<Button
							title='Logout'
							onPress={this.logout}
							buttonStyle={components.buttonStyle}
							titleStyle={components.buttonText}
						/>
					</View>
					<Divider style={{ width: '100%' }}/>
					<Formik
						initialValues={settingsFormInitialValues}
						onSubmit={this.saveSettings}
					>
						{props => (
							<View style={styles.settingsForm}>
								<Question
									containerStyle={styles.alarmPicker}
									question='Alarm Preferences'
									responses={alarmList.map((alarm, i) => ({ id: i, answer: alarm.displayName }))}
									onSelectResponse={handleFieldChangeFactory<SettingsFormValues>(props, 'alarmSelection')}
									selectedId={props.values.alarmSelection}
									expandable={true}
								/>

								<Question
									containerStyle={styles.dataSharingPicker}
									question='How should we handle your timer data?'
									responses={dataOptions.map((q, i) => ({ id: i, answer: q}))}
									onSelectResponse={handleFieldChangeFactory<SettingsFormValues>(props, 'dataSharingSelection')}
									selectedId={props.values.dataSharingSelection}
									expandable={true}
								/>

								<View style={styles.submitContainer}>
									<Button
										title='Save Changes'
										onPress={props.handleSubmit as any}
										buttonStyle={components.buttonStyle}
										titleStyle={components.buttonText}
										disabled={!props.dirty}
										loading={this.state.submittingSettings}
									/>
								</View>
							</View>
						)}
					</Formik>
					<Divider style={{ width: '100%' }}/>

				</ScrollView>
			</SafeAreaView>
		);
	}

}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%',
		padding: 8,
		display: 'flex',
		alignItems: 'center'
	},
	mainContainer: {
		display: 'flex',
		alignItems: 'center',
		// justifyContent: 'flex-start',
		minHeight: '100%'
	},
	user: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		maxWidth: '100%',
		width: '100%',
		marginBottom: 20,
		marginTop: 20
	},
	loginText: {
		display: 'flex',
		justifyContent: 'center',
		marginLeft: 40
	},
	avatar: {
		width: '35%'
	},
	loggedInAs: {
		textAlign: 'center',
		color: NEUTRAL[700]
	},
	loggedInUser: {
		textAlign: 'center',
		lineHeight: 75,
		maxWidth: 200
	},
	settingsForm: {
		marginTop: 20,
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	alarmPicker: {
		width: '100%'
	},
	dataSharingPicker: {},
	alarmPickerLabel: {
		alignSelf: 'center'
	},
	submitContainer: {
		// width: '100%',
		marginBottom: 40
	},
	logoutContainer: {
		// width: '100%',
		marginBottom: 40
	}
});

const oldStyles = StyleSheet.create({
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
	}
});
