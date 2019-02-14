import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import createNavigationOptions from '../common/NavigationOptionsFactory';
import Cronchy, { Accessories, Expression, Headwear, Skin } from '../components/Cronchy';
// import { typography } from '../common/StyleGuide';

export default class Avatar extends React.Component<NavigationScreenProps> {

	static navigationOptions = createNavigationOptions('Avatar', true);

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<Cronchy skin={Skin.GREEN_PLAIN} />
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
