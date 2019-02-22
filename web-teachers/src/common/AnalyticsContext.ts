import * as React from 'react';
import { BehaviorSubject } from 'rxjs';

import { AssignmentIdToCanvasInfo, UniqueClassAssignments, UniqueClassesTimeslots } from '../model/Analytics';
import { Timeslot } from '../model/Timeslot';
import withContextFactory from './HigherOrderConsumerFactory';

export interface WithAnalyticsContextProps {
	analyticsContext: AnalyticsContextType;
}

export interface AnalyticsContextType {
	// The OG data
	uniqueClassAssignments: BehaviorSubject<UniqueClassAssignments | null>;
	timeslots: BehaviorSubject<Timeslot[] | null>;
	// Stuff calculated from it
	assignmentIdToClass: BehaviorSubject<AssignmentIdToCanvasInfo | null>;
	// uniqueClasses: BehaviorSubject<string[] | null>;
	classesWithTimeslots: BehaviorSubject<string[] | null>;
	assignmentsWithTimeslots: BehaviorSubject<string[] | null>;
}

// tslint:disable-next-line:variable-name
export const AnalyticsContext = React.createContext<AnalyticsContextType>({
	uniqueClassAssignments: new BehaviorSubject<UniqueClassAssignments | null>(null),
	timeslots: new BehaviorSubject<Timeslot[] | null>(null),
	assignmentIdToClass: new BehaviorSubject<AssignmentIdToCanvasInfo | null>(null),
	// uniqueClasses: new BehaviorSubject<string[] | null>(null),
	classesWithTimeslots: new BehaviorSubject<string[] | null>(null),
	assignmentsWithTimeslots: new BehaviorSubject<string[] | null>(null)
});

export default withContextFactory(AnalyticsContext, 'analyticsContext');
