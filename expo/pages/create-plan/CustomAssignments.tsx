import bind from 'bind-decorator';
import * as React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Icon, FormLabel, FormInput } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';

import createNavigationOptions from '../../common/NavigationOptionsFactory';
// import { NEUTRAL } from '../../common/StyleGuide';

interface CustomAssignmentsState {
	taskName: string;
}

export default class CustomAssignments extends React.Component<NavigationScreenProps, CustomAssignmentsState> {

	static navigationOptions = createNavigationOptions('Custom', false, () => {
		return {
			tabBarIcon: ({ tintColor }: { tintColor: string }) => {
				return (
					<Icon
						name='plus'
						type='font-awesome'
						color={tintColor}
					/>
				);
			}
		};
	});

	constructor(props: any) {
		super(props);
		this.state = { taskName: '' };
	}

	componentDidMount() {
		// MyMICDS.canvas.getClasses().subscribe(({ hasURL, classes }) => {
		// 	this.setState({
		// 		classes: hasURL ? classes : []
		// 	});
		// });
	}

	@bind
	setTaskName(taskName: string) {
		this.setState({ taskName });
	}

	render() {
		return (
			<View style={styles.container}>
				{/*<FormLabel>Task Name</FormLabel>
				<FormInput
					placeholder={'Ex. College Apps'}
				/>
				<TextInput
					value={this.state.taskName}
					onChangeText={this.setTaskName}
					placeholder={'Username'}
				/>*/}
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		height: '100%'
	}
});
