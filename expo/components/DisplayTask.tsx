import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import { NEUTRAL, typography } from '../common/StyleGuide';
import Task from '../common/Task';

interface DisplayTasksProps {
	task: Task;
}

export default class Template extends React.Component<DisplayTasksProps> {

	static navigationOptions = {
		header: null
	};

	render() {
		const styles = StyleSheet.create({
			container: {
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				// backgroundColor: '#fff',
				backgroundColor: this.props.task.class.color,
				height: 100
			},
			taskContainer: {
			},
			classText: {
				textAlign: 'center',
				color: this.props.task.class.textDark ? NEUTRAL[900] : NEUTRAL[100]
			}
		});

		return (
			<View style={styles.container}>
				<View style={styles.taskContainer}>
					<Text
						style={[typography.h1, styles.classText]}
						numberOfLines={1}
						ellipsizeMode='tail'
					>
						{this.props.task.class.name}
					</Text>
					<Text
						style={[typography.h3, styles.classText]}
						numberOfLines={1}
						ellipsizeMode='tail'
					>
						{this.props.task.title}
					</Text>
				</View>
			</View>
		);
	}

}
