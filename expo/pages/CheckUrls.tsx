import bind from 'bind-decorator';
import { WebBrowser } from 'expo';
import * as React from 'react';
import { Alert, ImageBackground, ImageStyle, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import MyMICDS from '../common/MyMICDS';
import { components, NEUTRAL, nunito, PRIMARY, typography } from '../common/StyleGuide';
import { getMissingURLs, oxfordCommaList } from '../common/Utils';

interface CheckUrlsState {
	missingURLs: string[];
	hasRequired: boolean;
	checking: boolean;
}

export default class CheckUrls extends React.Component<NavigationScreenProps, CheckUrlsState> {

	static navigationOptions = {
		header: null
	};

	constructor(props: any) {
		super(props);
		this.state = {
			missingURLs: this.props.navigation.getParam('urls'),
			hasRequired: this.props.navigation.getParam('hasRequired'),
			checking: false
		};
	}

	@bind
	navigateToSettings() {
		WebBrowser.openBrowserAsync('https://mymicds.net/settings');
	}

	@bind
	checkUrl() {
		this.setState({ checking: true });
		MyMICDS.user.getInfo().subscribe(
			user => {
				const { urls, hasRequired } = getMissingURLs(user);
				if (urls.length === 0) {
					this.continue();
				} else {
					this.setState({
						missingURLs: urls,
						hasRequired
					});
					this.setState({ checking: false });
				}
			},
			err => {
				this.setState({ checking: false });
				Alert.alert('Login Error', err.message);
			}
		);
	}

	@bind
	continue() {
		this.props.navigation.navigate('App');
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
				<View style={styles.container}>
					<Text style={[typography.h2, styles.error]}>
						Looks like you haven't saved your {/**/}
						<Text style={nunito.black}>
							{oxfordCommaList(this.state.missingURLs, 'or')} {/**/}
							feed{this.state.missingURLs.length > 1 && 's'}
						</Text>
						{/**/} on MyMICDS.
					</Text>
					<Text onPress={this.navigateToSettings} style={[typography.body, nunito.light, styles.moreInfo]}>
						To use Cronch, Go to {/* Preserve whitespace in template */}
						<Text style={[nunito.bold, styles.link]}>MyMICDS.net/settings</Text>  {/*Spce*/}
						and follow the directions under <Text style={[nunito.bold, styles.link]}>'URL Settings'</Text>
					</Text>
					<ImageBackground
						source={require('../assets/mymicds/urls.png')}
						style={styles.imageContainer}
						imageStyle={styles.image as ImageStyle}
					/>
					<Text style={[typography.body, styles.recommend]}>We recommend configuring your URLs on your computer.</Text>
					{this.state.missingURLs.length > 0 && (
						<Button
							title='Check Again'
							loading={this.state.checking}
							onPress={this.checkUrl}
							containerStyle={styles.buttonContainer}
							buttonStyle={components.buttonStyle}
							titleStyle={components.buttonText}
						/>
					)}
					{this.state.hasRequired && (
						<Text onPress={this.continue} style={[typography.body, styles.skip]}>Skip this Step</Text>
					)}
				</View>
			</SafeAreaView>
		);
	}

}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%',
		backgroundColor: PRIMARY[500]
	},
	container: {
		height: '100%',
		paddingLeft: 16,
		paddingRight: 16,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	error: {
		flexGrow: 0,
		marginTop: 16,
		marginBottom: 16,
		color: NEUTRAL[100]
	},
	moreInfo: {
		flexGrow: 0,
		color: NEUTRAL[300]
	},
	link: {
		textDecorationLine: 'underline'
	},
	imageContainer: {
		flexGrow: 1,
		width: '100%',
		marginTop: 16,
		marginBottom: 16,
		resizeMode: 'contain'
	},
	image: {
		resizeMode: 'contain'
	},
	recommend: {
		marginBottom: 16,
		color: NEUTRAL[100],
		textAlign: 'center'
	},
	buttonContainer: {
		flexGrow: 0
	},
	skip: {
		marginTop: 16,
		textDecorationLine: 'underline',
		color: NEUTRAL[300]
	}
});
