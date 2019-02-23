import * as React from 'react';
import { BehaviorSubject } from 'rxjs';

import { CanvasEventsWithData, MostData } from '../model/Analytics';
import { Timeslot } from '../model/Timeslot';
import withContextFactory from './HigherOrderConsumerFactory';

export interface WithAnalyticsContextProps {
	analyticsContext: AnalyticsContextType;
}

export interface AnalyticsContextType {
	timeslots: BehaviorSubject<Timeslot[] | null>;
	canvasEventsWithData: BehaviorSubject<CanvasEventsWithData | null>;
	mostData: BehaviorSubject<MostData | null>;
}

// tslint:disable-next-line:variable-name
export const AnalyticsContext = React.createContext<AnalyticsContextType>({
	timeslots: new BehaviorSubject<Timeslot[] | null>(null),
	canvasEventsWithData: new BehaviorSubject<CanvasEventsWithData | null>(null),
	mostData: new BehaviorSubject<MostData | null>(null)
});

export default withContextFactory(AnalyticsContext, 'analyticsContext');
