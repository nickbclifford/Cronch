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

const skinPaths = {
	[Skin.GREEN_PLAIN]: '../assets/apples/skins/green-plain.png',
	[Skin.GREEN_LIGHT_SPECKLES]: '../assets/apples/skins/green-light-speckles.png',
	[Skin.GREEN_WHITE_SPECKLES]: '../assets/apples/skins/green-speckles.png',
	[Skin.GREEN_GREEN_SPECKLES]: '../assets/apples/skins/green-green-speckles.png',
	[Skin.RED_PLAIN]: '../assets/apples/skins/red-plain.png',
	[Skin.RED_SPECKLES]: '../assets/apples/skins/red-speckles.png',
	[Skin.PEACHY_PLAIN]: '../assets/apples/skins/peachy-plain.png',
	[Skin.PEACHY_SPECKLES]: '../assets/apples/skins/peachy-speckles.png'
};

export enum Expression {
	ANGEREY,
	CONCERNED,
	CRY,
	OH,
	OUO,
	VERY_CONCERNED
}

const expressionPaths = {
	[Expression.ANGEREY]: '../assets/apples/expressions/angey,.png',
	[Expression.CONCERNED]: '../assets/apples/expressions/concerned.png',
	[Expression.CRY]: '../assets/apples/expressions/cry.png',
	[Expression.OH]: '../assets/apples/expressions/oh.png',
	[Expression.OUO]: '../assets/apples/expressions/ouo.png',
	[Expression.VERY_CONCERNED]: '../assets/apples/expressions/very-concerned.png'
};

export enum Headwear {
	GENERIC_GLASSES,
	SPONGEBOB_GLASSES
}

const headwearPaths = {
	[Headwear.GENERIC_GLASSES]: '../assets/apples/headwear/generic-glasses.png',
	[Headwear.SPONGEBOB_GLASSES]: '../assets/apples/headwear/spongebob-glasses.png'
};

export interface HamburgerProps {
	skin: Skin;
	expression?: Expression;
	headwear?: Headwear[];
}

export default class Hamburger extends React.Component<HamburgerProps> {

	render() {
		return (
			<View>
				<Image source={require(skinPaths[this.props.skin])} />
			</View>
		);
	}

}

const styles = StyleSheet.create({
	appleSlice: {
	}
});
