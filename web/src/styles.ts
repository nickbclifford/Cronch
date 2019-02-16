/* tslint:disable:no-trailing-whitespace */
import { createMuiTheme } from '@material-ui/core';
import { purple } from '@material-ui/core/colors';
import styled from 'styled-components';

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

export const DANGER: ColorPalette = {
	100: '#FCE8E8',
	300: '#F49895',
	500: '#DE2E28',
	700: '#95120E',
	900: '#571413'
};

export const Button = styled.button`
	padding-top: 12px;
	padding-right: 48px;
	padding-left: 48px;
	padding-bottom: 12px;
	background-color: ${PRIMARY[900]};
	border-radius: 32px;
	border: none;
	color: ${NEUTRAL[100]};
`;

export const theme = createMuiTheme({
	palette: {
		primary: purple,
		error: DANGER,
		grey: NEUTRAL
	},
	typography: {
		fontFamily: 'Nunito, sans-serif'
	}
});
