import bind from 'bind-decorator';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';

import styles from './App.module.scss';
import { AnalyticsContext, AnalyticsContextType } from './common/AnalyticsContext';
import MyMICDS from './common/MyMICDS';
import { pickProps } from './common/Utils';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import {
	CanvasEventsWithTimeslots,
	EventIdToUniqueEvent
} from './model/Analytics';
import { getAllTimeslots, Timeslot } from './model/Timeslot';

import ClassesList from './pages/ClassesList';
import Heatmap from './pages/Heatmap';
import Login from './pages/Login';
import Logout from './pages/Logout';

interface AppState extends AnalyticsContextType {
	loading: boolean;
}

export default class App extends React.Component<any, AppState> {

	constructor(props: any) {
		super(props);
		this.state = {
			loading: true,
			timeslots: new BehaviorSubject<Timeslot[] | null>(null),
			canvasEventsWithTimeslots: new BehaviorSubject<CanvasEventsWithTimeslots | null>(null)
		};
	}

	componentDidMount() {
		MyMICDS.errors.subscribe(err => {
			console.log('error', err);
			alert(`MyMICDS Error ${err.message}`);
		});

		MyMICDS.auth.$.pipe(
			filter(auth => auth !== undefined),
			tap(() => {
				if (this.state.loading) {
					this.setState({ loading: false });
				}
			}),
			filter(auth => auth !== null),
			first()
		).subscribe(this.setupAnalytics);
	}

	@bind
	private setupAnalytics() {

		// Calculate other data once we have both MyMICDS and timeslot data
		combineLatest(
			MyMICDS.canvas.getUniqueEvents(),
			getAllTimeslots()
		).subscribe(
			([{ events: uniqueEvents }, timeslots]) => {
				this.state.timeslots.next(timeslots);
				if (!uniqueEvents || !timeslots) {
					return;
				}

				const uniqueCanvasClasses = Object.keys(uniqueEvents).sort();
				// console.log('unique events', uniqueEvents);

				const assignmentIdMap: EventIdToUniqueEvent = {};
				for (const canvasClass of uniqueCanvasClasses) {
					const assignments = uniqueEvents[canvasClass];

					for (const assignment of assignments) {
						assignmentIdMap[assignment._id] = assignment;
					}
				}

				// Calculate the timeslots associated with a assignment
				const eventsWithTimeslots: CanvasEventsWithTimeslots = {};
				// const map: AssignmentIdToTimeslots = {};
				for (const timeslot of timeslots) {
					const canvasInfo = assignmentIdMap[timeslot.classId];
					if (!canvasInfo) {
						console.log('No canvas info for', timeslot.classId);
						continue;
					}

					// { canvasClass, canvasEvent }

					if (!eventsWithTimeslots[canvasInfo.className]) {
						eventsWithTimeslots[canvasInfo.className] = {};
					}

					if (!eventsWithTimeslots[canvasInfo.className][canvasInfo.name]) {
						const canvasInfoWithTimeslot = Object.assign({}, canvasInfo, { timeslots: [] });
						eventsWithTimeslots[canvasInfo.className][canvasInfo.name] = canvasInfoWithTimeslot;
					}

					eventsWithTimeslots[canvasInfo.className][canvasInfo.name].timeslots.push(timeslot);
				}
				this.state.canvasEventsWithTimeslots.next(eventsWithTimeslots);
				console.log('events with timeslots', eventsWithTimeslots);
			}
		);

	}

	@bind
	redirectToDefault() {
		return (
			<Redirect to='/heatmap' />
		);
	}

	render() {
		if (this.state.loading) {
			return (
				<p>Loading...</p>
			);
		} else {
			return (
				<AnalyticsContext.Provider
					value={pickProps(this.state, [
						'timeslots',
						'canvasEventsWithTimeslots'
					])}
				>
					<div className={styles.appContainer}>
						<Navbar className={styles.navbar} />
						<div className={styles.routeContainer}>
							<Switch>
								<Route exact={true} path='/' render={this.redirectToDefault} />
								<Route path='/login' component={Login} />
								<Route path='/logout' component={Logout} />
								<PrivateRoute path='/classes' component={ClassesList} />
								<PrivateRoute path='/heatmap' component={Heatmap} />
								<Route render={this.redirectToDefault} />
							</Switch>
						</div>
					</div>
				</AnalyticsContext.Provider>
			);
		}
	}
}
