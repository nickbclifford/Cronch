import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'react-native-elements';

export enum Skin {
	GREEN_PLAIN,
	GREEN_LIGHT_SPECKLES,
	GREEN_WHITE_SPECKLES,
	GREEN_GREEN_SPECKLES,
	RED_PLAIN,
	RED_SPECKLES,
	PEACHY_PLAIN,
	PEACHY_SPECKLES
}

const skinImages = {
	[Skin.GREEN_PLAIN]: require('../assets/apples/skins/green-plain.png'),
	[Skin.GREEN_LIGHT_SPECKLES]: require('../assets/apples/skins/green-light-speckles.png'),
	[Skin.GREEN_WHITE_SPECKLES]: require('../assets/apples/skins/green-speckles.png'),
	[Skin.GREEN_GREEN_SPECKLES]: require('../assets/apples/skins/green-green-speckles.png'),
	[Skin.RED_PLAIN]: require('../assets/apples/skins/red-plain.png'),
	[Skin.RED_SPECKLES]: require('../assets/apples/skins/red-speckles.png'),
	[Skin.PEACHY_PLAIN]: require('../assets/apples/skins/peachy-plain.png'),
	[Skin.PEACHY_SPECKLES]: require('../assets/apples/skins/peachy-speckles.png')
};

export enum Expression {
	ANGEREY,
	CONCERNED,
	CRY,
	OH,
	OUO,
	VERY_CONCERNED
}

const expressionImages = {
	[Expression.ANGEREY]: require('../assets/apples/expressions/angey,.png'),
	[Expression.CONCERNED]: require('../assets/apples/expressions/concerned.png'),
	[Expression.CRY]: require('../assets/apples/expressions/cry.png'),
	[Expression.OH]: require('../assets/apples/expressions/oh.png'),
	[Expression.OUO]: require('../assets/apples/expressions/ouo.png'),
	[Expression.VERY_CONCERNED]: require('../assets/apples/expressions/very-concerned.png')
};

export enum Headwear {
	GENERIC_GLASSES,
	SPONGEBOB_GLASSES
}

const headwearImages = {
	[Headwear.GENERIC_GLASSES]: require('../assets/apples/headwear/generic-glasses.png'),
	[Headwear.SPONGEBOB_GLASSES]: require('../assets/apples/headwear/spongebob-glasses.png')
};

export enum Accessories {
	DIAMOND_SWORD,
	SMASHTER_SWORD
}

const accessoryImages = {
	[Accessories.DIAMOND_SWORD]: require('../assets/apples/accessories/diamond-sword.png'),
	[Accessories.SMASHTER_SWORD]: require('../assets/apples/accessories/smashter-sword.png')
};

export interface CronchyProps {
	skin: Skin;
	expression?: Expression;
	headwear?: Headwear[];
}

export default class Cronchy extends React.Component<CronchyProps> {

	render() {
		if (!(this.props.skin in Skin)) {
			return null;
		}
		return (
			<View>
				<Image source={skinImages[this.props.skin]} />
			</View>
		);
	}

}

const styles = StyleSheet.create({
	appleSlice: {
	}
});
