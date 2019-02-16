import * as React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import { Accessory, Expression, Headwear, Skin } from '../common/AvatarTypes';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import { PRIMARY } from '../common/StyleGuide';
import Cronchy from '../components/Cronchy';

export default class Avatar extends React.Component<NavigationScreenProps> {

	static navigationOptions = createNavigationOptions('Avatar', true);

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<StatusBar barStyle='light-content' backgroundColor={PRIMARY[500]} animated={true} />
				<View style={styles.container}>
					<Cronchy
						style={styles.avatar}
						skin={Skin.GreenPlain}
						expression={Expression.OuO}
						headwear={[Headwear.SpongebobGlasses]}
						accessories={[Accessory.DiamondSword]}
					/>
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
		width: '100%',
		display: 'flex',
		alignItems: 'center'
	},
	avatar: {
		width: '80%'
	}
});
