import {
	Button as MaterialButton,
	createMuiTheme,
	Fab,
	withStyles,
	WithStyles
} from '@material-ui/core';
import { ButtonProps as MaterialButtonProps } from '@material-ui/core/Button';
import { purple } from '@material-ui/core/colors';
import { FabProps } from '@material-ui/core/Fab';
import React from 'react';

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

const buttonStyles = {
	customButton: {
		backgroundColor: PRIMARY[900],
		color: 'white'
	}
};

type FabButtonProps = WithStyles<typeof buttonStyles> & FabProps;
export const FabButton = withStyles(buttonStyles)(
	({ classes, ...props }: FabButtonProps) => <Fab className={classes.customButton} {...props} />
);

type ButtonProps = WithStyles<typeof buttonStyles> & MaterialButtonProps;
export const Button = withStyles(buttonStyles)(
	({ classes, ...props }: ButtonProps) => <MaterialButton className={classes.customButton} {...props} />
);

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
