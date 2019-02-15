import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import { Accessory, Expression, Headwear, Skin } from '../common/AvatarTypes';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import Cronchy from '../components/Cronchy';
// import { typography } from '../common/StyleGuide';

export default class Avatar extends React.Component<NavigationScreenProps> {

	static navigationOptions = createNavigationOptions('Avatar', true);

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
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
