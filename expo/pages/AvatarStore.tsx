import * as React from 'react';
import { ImageStyle, ScrollView, StatusBar, StyleProp, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Image } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import bind from 'bind-decorator';
import { Accessory, accessoryImages, Expression, expressionImages, Headwear, headwearImages, Skin, skinImages } from '../common/AvatarTypes';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import { PRIMARY, typography } from '../common/StyleGuide';
import Cronchy from '../components/Cronchy';

const allImages = { ...skinImages, ...expressionImages, ...headwearImages, ...accessoryImages };

interface AvatarStoreState {
	selectedCategory: number;
}

export default class AvatarStore extends React.Component<NavigationScreenProps, AvatarStoreState> {

	static navigationOptions = createNavigationOptions('Template Title', true);

	constructor(props: NavigationScreenProps) {
		super(props);

		this.state = {
			selectedCategory: 0
		};
	}

	@bind
	selectCategoryFactory(n: number) {
		return () => {
			this.setState({
				selectedCategory: n
			});
		};
	}

	render() {
		console.log(skinImages.PEACHY_PLAIN);
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
					<View style={styles.store}>
						<ScrollView style={styles.categories} horizontal={true}>
							{['Skin', 'Expression', 'Headwear', 'Accessories'].map((title, i) => (
								<TouchableHighlight key={i} style={styles.categoriesText} onPress={this.selectCategoryFactory(i)}>
									<Text style={typography.h2}>{title}</Text>
								</TouchableHighlight>
							))}
						</ScrollView>
						{[Skin, Expression, Headwear, Accessory].map((category, i) => i === this.state.selectedCategory && (
							<ScrollView key={i} style={styles.details} horizontal={true}>
								{Object.keys(category).map((itemString, i2) => (
									<Image key={i2} source={allImages[itemString]} style={styles.detailsImage as StyleProp<ImageStyle>}/>
								))}
							</ScrollView>
						))}
					</View>
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
		height: '100%',
		display: 'flex'
	},
	avatar: {
		flexGrow: 1,
		flexShrink: 1,
		marginLeft: 48,
		marginRight: 48
	},
	store: {
		flexGrow: 0,
		flexShrink: 0
	},
	categories: {
		height: '20%',
		flexDirection: 'row',
		backgroundColor: '#aaa'
	},
	categoriesText: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 10,
		paddingBottom: 10
	},
	details: {
		backgroundColor: '#ddd'
	},
	detailsImage: {
		width: 200,
		height: 200,
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 10,
		paddingBottom: 10
	}
});
