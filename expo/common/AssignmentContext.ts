import { CanvasEvent } from '@mymicds/sdk';
import * as React from 'react';

export interface AssignmentContextType {
	// TODO: Properly type this
	assignments: CanvasEvent[];
	updateAssignments(newAssignments: CanvasEvent[]): void;
	appendAssignment(newAssignment: CanvasEvent): void;
}

// tslint:disable-next-line:variable-name
const AssignmentContext = React.createContext<AssignmentContextType>({
	assignments: [],
	// tslint:disable:no-empty
	updateAssignments: () => {},
	appendAssignment: () => {}
	// tslint:enable:no-empty
});

export default AssignmentContext;
