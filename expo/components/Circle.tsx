import bind from 'bind-decorator';
import * as React from 'react';
import { ImageStyle, LayoutChangeEvent, RegisteredStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Image from 'react-native-scalable-image';

export interface CircleProps {
	color: string;
	containerStyle?: StyleProp<ViewStyle>;
}

interface CircleState {
	radius: number;
}

export default class Circle extends React.Component<CircleProps, CircleState> {

	constructor(props: any) {
		super(props);
		this.state = { radius: 0 };
	}

	@bind
	onResize(event: LayoutChangeEvent) {
		this.setState({
			radius: Math.min(event.nativeEvent.layout.width, event.nativeEvent.layout.height) / 2
		});
	}

	render() {
		const styles = StyleSheet.create({
			circleContainer: {
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			},
			circle: {
				width: this.state.radius * 2,
				height: this.state.radius * 2,
				borderRadius: this.state.radius,
				backgroundColor: this.props.color
			}
		});

		return (
			<View onLayout={this.onResize} style={[styles.circleContainer, this.props.containerStyle]}>
				<View style={styles.circle} />
			</View>
		);
	}

}
