import { CanvasEvent } from '@mymicds/sdk';
import * as React from 'react';

export interface WithAssignmentContextProps {
	assignmentContext: AssignmentContextType;
}

export interface AssignmentContextType {
	assignments: CanvasEvent[];
	updateAssignments(newAssignments: CanvasEvent[]): void;
	appendAssignment(newAssignment: CanvasEvent): void;
}

// tslint:disable-next-line:variable-name
export const AssignmentContext = React.createContext<AssignmentContextType>({
	assignments: [],
	// tslint:disable:no-empty
	updateAssignments: () => {},
	appendAssignment: () => {}
	// tslint:enable:no-empty
});

export default function withAssignmentContext<P>(
	// tslint:disable-next-line:variable-name
	Component: React.ComponentType<P & WithAssignmentContextProps>
): React.SFC<P> {
	return props => (
		<AssignmentContext.Consumer>
			{context =>	<Component {...props} assignmentContext={context} />}
		</AssignmentContext.Consumer>
	);
}
