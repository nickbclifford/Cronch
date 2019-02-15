import bind from 'bind-decorator';
import * as React from 'react';
import { ImageStyle, LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Image from 'react-native-scalable-image';

import {
	Accessory,
	accessoryImages,
	Expression,
	expressionImages,
	Headwear,
	headwearImages,
	Skin,
	skinImages
} from '../common/AvatarTypes';

export interface CronchyProps {
	style?: StyleProp<ViewStyle>;
	skin: Skin;
	expression?: Expression;
	headwear?: Headwear[];
	accessories?: Accessory[];
}

interface CrunchyState {
	maxWidth: number;
	maxHeight: number;
}

export default class Cronchy extends React.Component<CronchyProps, CrunchyState> {

	constructor(props: any) {
		super(props);
		this.state = { maxWidth: 0, maxHeight: 0 };
	}

	@bind
	onResize(event: LayoutChangeEvent) {
		this.setState({
			maxWidth: event.nativeEvent.layout.width,
			maxHeight: event.nativeEvent.layout.height
		});
	}

	render() {
		const images = [];

		if (this.props.skin) {
			images.push(skinImages[this.props.skin]);
		}

		if (this.props.expression) {
			images.push(expressionImages[this.props.expression]);
		}

		if (this.props.headwear) {
			for (const headItem of this.props.headwear) {
				if (headItem) {
					images.push(headwearImages[headItem]);
				}
			}
		}

		if (this.props.accessories) {
			for (const accessory of this.props.accessories) {
				if (accessory) {
					images.push(accessoryImages[accessory]);
				}
			}
		}

		return (
			<View onLayout={this.onResize} style={[styles.container, this.props.style]}>
				{images.map((image, index) => {
					if (image) {
						return (
							<Image
								key={`${index}-${image}`}
								source={image}
								width={this.state.maxWidth}
								height={this.state.maxHeight}
								style={index > 0 && styles.appleSlice as StyleProp<ImageStyle>}
							/>
						);
					}
				})}
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	appleSlice: {
		position: 'absolute'
	}
});
