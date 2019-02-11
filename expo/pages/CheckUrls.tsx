import { WebBrowser } from 'expo';
import * as React from 'react';
import { ImageBackground, ImageStyle, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import { components, NEUTRAL, nunito, PRIMARY, typography } from '../common/StyleGuide';
import { oxfordCommaList } from '../common/Utils';

interface CheckUrlsProps extends NavigationScreenProps {
	message: string;
}

export default class CheckUrls extends React.Component<CheckUrlsProps> {

	static navigationOptions = {
		header: null
	};

	navigateToSettings() {
		WebBrowser.openBrowserAsync('https://mymicds.net/settings');
	}

	render() {
		const missingURLs = this.props.navigation.getParam('missingURLs');
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<Text style={[typography.h2, styles.error]}>
						Looks like you haven't saved your
						<Text style={nunito.bold}> {oxfordCommaList(missingURLs)} feed{missingURLs.length === 1 ? '' : 's'} </Text>
						on MyMICDS.
					</Text>
					<Text style={[typography.body, nunito.light, styles.moreInfo]}>
						To use Cronch, Go to your settings on MyMICDS.net and follow the directions under 'URL Settings' in {/* Space */}
						<Text style={[nunito.bold, styles.link]} onPress={this.navigateToSettings}>MyMICDS.net/settings</Text>
					</Text>
					<ImageBackground
						source={require('../assets/urls.png')}
						style={styles.imageContainer}
						imageStyle={styles.image as ImageStyle}
					/>
					<Text style={[typography.body, styles.recommend]}>We recommend configuring your URLs on your computer.</Text>
					<Button
						title='Check Again'
						containerStyle={styles.buttonContainer}
						buttonStyle={components.buttonStyle}
						titleStyle={components.buttonText}
					/>
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
	}
});
