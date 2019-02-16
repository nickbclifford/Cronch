export enum Skin {
	GreenPlain = 'GREEN_PLAIN',
	GreenLightSpeckes = 'GREEN_LIGHT_SPECKLES',
	GreenWhiteSpeckles = 'GREEN_WHITE_SPECKLES',
	GreenGreenSpeckles = 'GREEN_GREEN_SPECKLES',
	RedPlain = 'RED_PLAIN',
	RedSpeckles = 'RED_SPECKLES',
	PeachyPlain = 'PEACHY_PLAIN',
	PeachySpeckles = 'PEACHY_SPECKLES'
}

export const skinImages = {
	[Skin.GreenPlain]: require('../assets/apples/skins/green-plain.png'),
	[Skin.GreenLightSpeckes]: require('../assets/apples/skins/green-light-speckles.png'),
	[Skin.GreenWhiteSpeckles]: require('../assets/apples/skins/green-speckles.png'),
	[Skin.GreenGreenSpeckles]: require('../assets/apples/skins/green-green-speckles.png'),
	[Skin.RedPlain]: require('../assets/apples/skins/red-plain.png'),
	[Skin.RedSpeckles]: require('../assets/apples/skins/red-speckles.png'),
	[Skin.PeachyPlain]: require('../assets/apples/skins/peachy-plain.png'),
	[Skin.PeachySpeckles]: require('../assets/apples/skins/peachy-speckles.png')
};

export enum Expression {
	Angerey = 'ANGEREY',
	Concerned = 'CONCERNED',
	Cry = 'CRY',
	Oh = 'OH',
	OuO = 'OUO',
	VeryConerned = 'VERY_CONCERNED'
}

export const expressionImages = {
	[Expression.Angerey]: require('../assets/apples/expressions/angey,.png'),
	[Expression.Concerned]: require('../assets/apples/expressions/concerned.png'),
	[Expression.Cry]: require('../assets/apples/expressions/cry.png'),
	[Expression.Oh]: require('../assets/apples/expressions/oh.png'),
	[Expression.OuO]: require('../assets/apples/expressions/ouo.png'),
	[Expression.VeryConerned]: require('../assets/apples/expressions/very-concerned.png')
};

export enum Headwear {
	GenericGlasses = 'GENERIC_GLASSES',
	SpongebobGlasses = 'SPONGEBOB_GLASSES'
}

export const headwearImages = {
	[Headwear.GenericGlasses]: require('../assets/apples/headwear/generic-glasses.png'),
	[Headwear.SpongebobGlasses]: require('../assets/apples/headwear/spongebob-glasses.png')
};

export enum Accessory {
	DiamondSword = 'DIAMOND_SWORD',
	SmashterSword = 'SMASHTER_SWORD'
}

export const accessoryImages = {
	[Accessory.DiamondSword]: require('../assets/apples/accessories/diamond-sword.png'),
	[Accessory.SmashterSword]: require('../assets/apples/accessories/smashter-sword.png')
};
