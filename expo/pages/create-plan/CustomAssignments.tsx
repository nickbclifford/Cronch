import bind from 'bind-decorator';
import { Formik } from 'formik';
import moment from 'moment';
import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';

import withAssignmentContext, {	WithAssignmentContextProps } from '../../common/AssignmentContext';
import { Block, ClassType } from '../../common/MyMICDS';
import createNavigationOptions from '../../common/NavigationOptionsFactory';
import Task from '../../common/Task';

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

	@bind
	addCustomTaskToPlan({ taskName }: CustomAssignmentsForm) {
		const task: Task = {
			_id: taskName,
			class: {
				_id: taskName,
				user: '',
				name: 'Custom Task',
				teacher: {
					_id: null,
					prefix: '',
					firstName: '',
					lastName: ''
				},
				type: ClassType.OTHER,
				block: Block.OTHER,
				color: '#34444F',
				textDark: false
			},
			title: taskName,
			start: moment().startOf('day'),
			end: moment().endOf('day'),
			checked: false,
			desc: '',
			descPlaintext: ''
		};

		this.props.assignmentContext.appendAssignment(task);
		this.props.navigation.navigate('BattlePlan');
	}

	render() {
		return (
			<Formik
				initialValues={defaultFormValues}
				onSubmit={this.addCustomTaskToPlan}
			>
				{props => (
					<View>
						<TextInput
							placeholder='Task Name'
							onChangeText={props.handleChange('taskName')}
							onBlur={props.handleBlur('taskName')}
							value={props.values.taskName}
							style={styles.input}
						/>
						<Button title='Add to Plan' onPress={props.handleSubmit as any} />
					</View>
				)}
			</Formik>
		);
	}

}

export default withAssignmentContext(CustomAssignments);

const styles = StyleSheet.create({
	container: {
		height: '100%'
	},
	input: {
		marginLeft: 8,
		marginRight: 8,
		marginBottom: 32
	}
});
