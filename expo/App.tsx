import * as React from 'react';
import { Alert } from 'react-native';

import { AssignmentContext, AssignmentContextType } from './common/AssignmentContext';
import MyMICDS from './common/MyMICDS';
import AppContainer from './Navigation';

interface GlobalAppState extends AssignmentContextType { }

export default class App extends React.Component<{}, GlobalAppState> {

	constructor(props: {}) {
		super(props);

		this.state = {
			assignments: [],
			updateAssignments: newAssignments => {
				this.setState({ assignments: newAssignments });
			},
			appendAssignment: newAssignment => {
				const newAssignments = this.state.assignments;
				newAssignments.push(newAssignment);
				this.setState({ assignments: newAssignments });
			}
		};
	}

	componentDidMount() {
		MyMICDS.errors.subscribe(err => {
			console.log('buh');
			Alert.alert('Error', err.message);
		});
	}

	render() {
		return (
			<AssignmentContext.Provider value={this.state}>
				<AppContainer />
			</AssignmentContext.Provider>
		);
	}
}
