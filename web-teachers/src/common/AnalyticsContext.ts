import * as React from 'react';
import { BehaviorSubject } from 'rxjs';

import { UniqueClassAssignments, UniqueClassesTimeslots } from '../model/Analytics';
import { Timeslot } from '../model/Timeslot';
import withContextFactory from './HigherOrderConsumerFactory';

export interface WithAnalyticsContextProps {
	analyticsContext: AnalyticsContextType;
}

export interface AnalyticsContextType {
	uniqueClasses: BehaviorSubject<string[] | null>;
	uniqueClassAssignments: BehaviorSubject<UniqueClassAssignments | null>;
	timeslots: BehaviorSubject<Timeslot[] | null>;
	uniqueClassTimeslots: BehaviorSubject<UniqueClassesTimeslots | null>;
}

// tslint:disable-next-line:variable-name
export const AnalyticsContext = React.createContext<AnalyticsContextType>({
	uniqueClasses: new BehaviorSubject<string[] | null>(null),
	uniqueClassAssignments: new BehaviorSubject<UniqueClassAssignments | null>(null),
	timeslots: new BehaviorSubject<Timeslot[] | null>(null),
	uniqueClassTimeslots: new BehaviorSubject<UniqueClassesTimeslots | null>(null)
});

export default withContextFactory(AnalyticsContext, 'analyticsContext');
