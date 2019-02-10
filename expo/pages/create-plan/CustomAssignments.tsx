import bind from 'bind-decorator';
import { Formik } from 'formik';
import * as React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';

import withAssignmentContext, {	WithAssignmentContextProps } from '../../common/AssignmentContext';
import createNavigationOptions from '../../common/NavigationOptionsFactory';
import { NEUTRAL, PRIMARY, typography } from '../../common/StyleGuide';
import { createCustomTask } from '../../common/Task';

interface CustomAssignmentsForm {
	taskName: string;
}

const defaultFormValues: CustomAssignmentsForm = {
	taskName: ''
};

class CustomAssignments extends React.Component<NavigationScreenProps & WithAssignmentContextProps> {

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

	@bind
	addCustomTaskToPlan({ taskName }: CustomAssignmentsForm) {
		this.props.assignmentContext.appendAssignment(createCustomTask(taskName));
		this.props.navigation.navigate('BattlePlan');
	}

	render() {
		return (
			<Formik
				initialValues={defaultFormValues}
				onSubmit={this.addCustomTaskToPlan}
			>
				{props => (
					<View style={styles.container}>
						<Text style={typography.h2}>Custom Event Title</Text>
						<TextInput
							placeholder='Ex. College Apps'
							onChangeText={props.handleChange('taskName')}
							onBlur={props.handleBlur('taskName')}
							value={props.values.taskName}
							style={[typography.body, styles.input]}
							placeholderTextColor={NEUTRAL[500]}
						/>
						<Button
							title='Add to Plan'
							buttonStyle={styles.submitButton}
							titleStyle={styles.submitText}
							onPress={props.handleSubmit as any}
						/>
					</View>
				)}
			</Formik>
		);
	}

}

export default withAssignmentContext(CustomAssignments);

const styles = StyleSheet.create({
	container: {
		paddingTop: 32,
		paddingLeft: 8,
		paddingRight: 8,
		paddingBottom: 32
	},
	input: {
		marginBottom: 32,
		padding: 8,
		backgroundColor: NEUTRAL[300],
		color: NEUTRAL[700],
		borderRadius: 5
	},
	submitButton: {
		paddingTop: 8,
		paddingBottom: 8,
		backgroundColor: PRIMARY[700]
	},
	submitText: {
		textTransform: 'uppercase'
	}
});
