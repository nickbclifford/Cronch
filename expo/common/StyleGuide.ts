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
	300: '#DADADA',
	500: '#81848C',
	700: '#616366',
	900: '#202226'
};

/** @todo  */

export const INFO: ColorPalette = {
	100: '#',
	300: '#',
	500: '#',
	700: '#',
	900: '#'
};

export const SUCCESS: ColorPalette = {
	100: '#',
	300: '#',
	500: '#',
	700: '#',
	900: '#'
};

export const WARNING: ColorPalette = {
	100: '#',
	300: '#',
	500: '#',
	700: '#',
	900: '#'
};

export const DANGER: ColorPalette = {
	100: '#',
	300: '#',
	500: '#',
	700: '#',
	900: '#'
};

export const DEFAULT_TYPOGRAPHY_STYLES = {
	color: NEUTRAL[900],
	fontFamily: 'Nunito-Regular'
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
		fontSize: 16
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
