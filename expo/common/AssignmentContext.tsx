import { CanvasEvent } from '@mymicds/sdk';
import * as React from 'react';

export interface WithAssignmentContextProps {
	assignmentContext: AssignmentContextType;
}

interface WithNavigationOptions {
	navigationOptions?: any;
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
	Component: React.ComponentType<P & WithAssignmentContextProps> & WithNavigationOptions
) {
	const sfc: React.SFC<P> & WithNavigationOptions = props => (
		<AssignmentContext.Consumer>
			{context => <Component {...props} assignmentContext={context} />}
		</AssignmentContext.Consumer>
	);

	// Pass on possible React Navigation options
	const options = Component.navigationOptions;
	if (typeof options !== 'undefined') {
		sfc.navigationOptions = options;
	}
	return sfc;
}
