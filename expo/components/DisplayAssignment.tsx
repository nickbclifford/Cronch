import * as React from 'react';
import {
	StyleProp,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	ViewStyle
} from 'react-native';
import { Icon } from 'react-native-elements';

import { NEUTRAL, typography } from '../common/StyleGuide';
import Task from '../common/Task';
import { optionalFunction } from '../common/Utils';

export type PressHandler = (task: Task) => void;

interface DisplayAssignmentProps {
	assignment: Task;
	leftIcon?: string;
	leftIconOnPress?: PressHandler;
	leftIconOnPressIn?: PressHandler;
	leftIconOnPressOut?: PressHandler;
	rightIcon?: string;
	rightIconOnPress?: PressHandler;
	rightIconOnPressIn?: PressHandler;
	rightIconOnPressOut?: PressHandler;
	itemStyle?: StyleProp<ViewStyle>;
	paddingRight?: number;
	paddingLeft?: number;
	onAssignmentClick?: PressHandler;
}

export default class DisplayAssignment extends React.Component<DisplayAssignmentProps> {

	render() {
		const assignment = this.props.assignment;
		const itemStyles = StyleSheet.create({
			container: {
				display: 'flex',
				flexDirection: 'row',
				marginRight: this.props.paddingRight,
				marginLeft: this.props.paddingLeft,
				marginBottom: 8,
				padding: 8,
				borderRadius: 5,
				backgroundColor: assignment.class.color
			},
			leftIconContainer: {
				display: 'flex',
				justifyContent: 'center',
				marginRight: 8
			},
			rightIconContainer: {
				display: 'flex',
				justifyContent: 'center',
				marginLeft: 8
			},
			assignmentContainer: {
				flexGrow: 1,
				flexShrink: 1
			},
			title: {
				color: assignment.class.textDark ? NEUTRAL[900] : NEUTRAL[100]
			},
			class: {
				color: assignment.class.textDark ? NEUTRAL[700] : NEUTRAL[300]
			},
			addContainer: {
				display: 'flex',
				flexDirection: 'column'
			}
		});

		return (
			<View style={this.props.itemStyle}>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={optionalFunction(this.props.onAssignmentClick, assignment)}
				>
					<View style={itemStyles.container}>
						{this.props.leftIcon && (
							<TouchableWithoutFeedback
								hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
								onPress={optionalFunction(this.props.leftIconOnPress, assignment)}
								onPressIn={optionalFunction(this.props.leftIconOnPressIn, assignment)}
								onPressOut={optionalFunction(this.props.leftIconOnPressOut, assignment)}
							>
								<View style={itemStyles.leftIconContainer}>
									<Icon
										name={this.props.leftIcon}
										type='font-awesome'
										size={20}
										color={assignment.class.textDark ? NEUTRAL[900] : NEUTRAL[100]}
									/>
								</View>
							</TouchableWithoutFeedback>
						)}
						<View style={itemStyles.assignmentContainer}>
							<Text
								style={[typography.h3, itemStyles.class]}
								numberOfLines={1}
								ellipsizeMode='tail'
							>
								{assignment.class.name}
							</Text>
							<Text
								style={[typography.h2, itemStyles.title]}
								numberOfLines={1}
								ellipsizeMode='tail'
							>
								{assignment.title}
							</Text>
						</View>
						{this.props.rightIcon && (
							<TouchableWithoutFeedback
								hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
								onPress={optionalFunction(this.props.rightIconOnPress, assignment)}
								onPressIn={optionalFunction(this.props.rightIconOnPressIn, assignment)}
								onPressOut={optionalFunction(this.props.rightIconOnPressOut, assignment)}
							>
								<View style={itemStyles.rightIconContainer}>
									<Icon
										name={this.props.rightIcon}
										type='font-awesome'
										size={20}
										color={assignment.class.textDark ? NEUTRAL[900] : NEUTRAL[100]}
									/>
								</View>
							</TouchableWithoutFeedback>
						)}
					</View>
				</TouchableOpacity>
			</View>
		);
	}

}
