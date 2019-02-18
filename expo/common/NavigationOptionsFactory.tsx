import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';
import { NEUTRAL, PRIMARY } from '../common/StyleGuide';

export default function generateNavigationOptions<Props extends NavigationScreenProps>(
	title: string | null,
	menuButton = true,
	additionalInfo?: (props: Props) => { [key: string]: any }
): (props: Props) => { [key: string]: any } {
	return props => {
		const onPressLeft = () => {
			props.navigation.toggleDrawer();
		};

		const options: { [key: string]: any } = {
			title,
			headerStyle: {
				backgroundColor: PRIMARY[500]
			},
			headerTintColor: NEUTRAL[100]
		};

		if (menuButton) {
			options.headerLeft = <Button title='Menu' type='clear' titleStyle={styles.menu} onPress={onPressLeft} />;
		}

		if (additionalInfo) {
			const info = additionalInfo(props);
			return { ...options, ...info };
		} else {
			return options;
		}
	};
}

const styles = StyleSheet.create({
	menu: {
		color: NEUTRAL[300]
	}
});

export const menuStyle = styles.menu;
