import * as React from 'react';
import Task from '../common/Task';
import withContextFactory from './HigherOrderConsumerFactory';

export interface WithAssignmentContextProps {
	assignmentContext: AssignmentContextType;
}

export interface AssignmentContextType {
	assignments: Task[];
	updateAssignments(newAssignments: Task[]): void;
	appendAssignment(newAssignment: Task): void;
	deleteAssignment(id: Task['_id']): void;
}

// tslint:disable-next-line:variable-name
export const AssignmentContext = React.createContext<AssignmentContextType>({
	assignments: [],
	// tslint:disable:no-empty
	updateAssignments: () => {},
	appendAssignment: () => {},
	deleteAssignment: () => {}
	// tslint:enable:no-empty
});

export default withContextFactory(AssignmentContext, 'assignmentContext');
