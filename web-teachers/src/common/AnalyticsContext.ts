import * as React from 'react';
import { BehaviorSubject } from 'rxjs';

import { CanvasEventsWithTimeslots } from '../model/Analytics';
import { Timeslot } from '../model/Timeslot';
import withContextFactory from './HigherOrderConsumerFactory';

export interface WithAnalyticsContextProps {
	analyticsContext: AnalyticsContextType;
}

export interface AnalyticsContextType {
	timeslots: BehaviorSubject<Timeslot[] | null>;
	canvasEventsWithTimeslots: BehaviorSubject<CanvasEventsWithTimeslots | null>;
}

// tslint:disable-next-line:variable-name
export const AnalyticsContext = React.createContext<AnalyticsContextType>({
	timeslots: new BehaviorSubject<Timeslot[] | null>(null),
	canvasEventsWithTimeslots: new BehaviorSubject<CanvasEventsWithTimeslots | null>(null)
});

export default withContextFactory(AnalyticsContext, 'analyticsContext');
