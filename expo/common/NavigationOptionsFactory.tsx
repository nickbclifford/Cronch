import * as React from 'react';
import { Button, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';
import { NEUTRAL, PRIMARY } from '../common/StyleGuide';

export default function generateNavigationOptions<Props extends NavigationScreenProps>(
	title: string | null,
	menuButton = true,
	additionalInfo?: (props: Props) => { [key: string]: any }
): (props: Props) => { [key: string]: any } {
	return props => {
		const menuStyles = StyleSheet.create({
			hamburger: {
				marginLeft: 16
			}
		});

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
			// headerLeft: (
			// 	<Icon
			// 		name='bars'
			// 		type='font-awesome'
			// 		containerStyle={menuStyles.hamburger}
			// 		onPress={onPressLeft}
			// 	/>
			// )
			options.headerLeft = <Button title='Menu' color={NEUTRAL[300]} onPress={onPressLeft} />;
		}

		if (additionalInfo) {
			const info = additionalInfo(props);
			return { ...options, ...info };
		} else {
			return options;
		}
	};
}
