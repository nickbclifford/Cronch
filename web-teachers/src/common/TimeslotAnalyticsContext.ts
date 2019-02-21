import * as React from 'react';
import { Subject } from 'rxjs';

import { Timeslot } from '../model/Timeslot';
import withContextFactory from './HigherOrderConsumerFactory';

export interface WithAssignmentContextProps {
	assignmentContext: AssignmentContextType;
}

export interface AssignmentContextType {
	uniqueClasses: string[];
	timeslots: { [uniqueClass: string]: Timeslot[] };
}

// tslint:disable-next-line:variable-name
export const AssignmentContext = React.createContext<AssignmentContextType>({
	assignments: [],
	onAssignmentsChange: new Subject(),
	// tslint:disable:no-empty
	updateAssignments: () => {},
	appendAssignment: () => {},
	deleteAssignment: () => {}
	// tslint:enable:no-empty
});

export default withContextFactory(AssignmentContext, 'assignmentContext');
