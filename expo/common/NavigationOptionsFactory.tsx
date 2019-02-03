import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';

export default function generateNavigationOptions<Props extends NavigationScreenProps>(
	title: string,
	additionalInfo?: (props: Props) => { [key: string]: any }
): (props: Props) => { [key: string]: any } {
	return props => {
		const menuStyles = StyleSheet.create({
			hamburger: {
				marginLeft: 16
			},
			edit: {
				marginRight: 16
			}
		});

		const onPressLeft = () => {
			props.navigation.toggleDrawer();
		};

		const options = {
			title,
			headerLeft: (
				<Icon
					name='bars'
					type='font-awesome'
					containerStyle={menuStyles.hamburger}
					onPress={onPressLeft}
				/>
			)
		};

		if (additionalInfo) {
			const info = additionalInfo(props);
			return { ...options, ...info };
		} else {
			return options;
		}
	};
}
