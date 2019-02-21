import { GetUniqueEventsResponse } from '../common/MyMICDS';
import { Timeslot } from './Timeslot';

export interface UniqueClassesTimeslots {
	[uniqueClass: string]: Timeslot[];
}

export interface AssignmentIdToCanvasNameMap {
	[assignmentId: string]: string;
}

export type UniqueClassAssignments = GetUniqueEventsResponse['events'];
