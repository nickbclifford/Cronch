import * as React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import bind from 'bind-decorator';
import { Accessory, Expression, Headwear, Skin } from '../common/AvatarTypes';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import { components, PRIMARY } from '../common/StyleGuide';
import Cronchy from '../components/Cronchy';

export default class Avatar extends React.Component<NavigationScreenProps> {

	static navigationOptions = createNavigationOptions('Avatar', true);

	@bind
	private navigateToAvatarStore() {
		this.props.navigation.navigate('AvatarStore');
	}

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
				<Button
					title='Customize'
					containerStyle={styles.buttonContainer}
					buttonStyle={components.buttonStyle}
					titleStyle={components.buttonText}
					onPress={this.navigateToAvatarStore}
				/>
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
	},
	buttonContainer: {
		width: '80%'
	}
});
