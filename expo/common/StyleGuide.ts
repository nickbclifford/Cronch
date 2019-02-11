import { StyleSheet } from 'react-native';

export interface ColorPalette {
	100: string;
	300: string;
	500: string;
	700: string;
	900: string;
}

export const PRIMARY: ColorPalette = {
	100: '#F9EBFF',
	300: '#E6AFFB',
	500: '#CC76EE',
	700: '#7C16A5',
	900: '#540174'
};

export const NEUTRAL: ColorPalette = {
	100: '#F7F7F7',
	300: '#E4E4E4',
	500: '#81848C',
	700: '#616366',
	900: '#202226'
};

export const INFO: ColorPalette = {
	100: '#E6FFFE',
	300: '#78E5DB',
	500: '#35AEA3',
	700: '#177169',
	900: '#0F4443'
};

export const SUCCESS: ColorPalette = {
	100: '#E2FCEC',
	300: '#86D1A3',
	500: '#2EC26F',
	700: '#269651',
	900: '#0F5036'
};

export const WARNING: ColorPalette = {
	100: '#FFFCF4',
	300: '#FFE49C',
	500: '#F5CB5B',
	700: '#BE9017',
	900: '#54420B'
};

export const DANGER: ColorPalette = {
	100: '#FCE8E8',
	300: '#F49895',
	500: '#DE2E28',
	700: '#95120E',
	900: '#571413'
};

export const nunito = StyleSheet.create({
	light: {
		fontFamily: 'Nunito-Light'
	},
	normal: {
		fontFamily: 'Nunito-Regular'
	},
	bold: {
		fontFamily: 'Nunito-Bold'
	},
	extraBold: {
		fontFamily: 'Nunito-ExtraBold'
	},
	black: {
		fontFamily: 'Nunito-Black'
	}
});

export const DEFAULT_TYPOGRAPHY_STYLES = {
	color: NEUTRAL[900],
	...StyleSheet.flatten(nunito.normal)
};

export const typography = StyleSheet.create({
	h1: {
		...DEFAULT_TYPOGRAPHY_STYLES,
		fontSize: 30
	},
	h2: {
		...DEFAULT_TYPOGRAPHY_STYLES,
		fontSize: 24
	},
	h3: {
		...DEFAULT_TYPOGRAPHY_STYLES,
		fontSize: 20
	},
	body: {
		...DEFAULT_TYPOGRAPHY_STYLES,
		fontSize: 16
	},
	small: {
		...DEFAULT_TYPOGRAPHY_STYLES,
		fontSize: 12
	}
});

export const components = StyleSheet.create({
	textInput: {
		...StyleSheet.flatten(typography.body),
		padding: 8,
		backgroundColor: NEUTRAL[300],
		color: NEUTRAL[700],
		borderRadius: 5
	},
	buttonStyle: {
		paddingTop: 12,
		paddingRight: 48,
		paddingLeft: 48,
		paddingBottom: 12,
		backgroundColor: PRIMARY[700],
		borderRadius: 32
	},
	buttonText: {
		textTransform: 'uppercase'
	}
});

export const textInputPlaceholderColor = NEUTRAL[500];
