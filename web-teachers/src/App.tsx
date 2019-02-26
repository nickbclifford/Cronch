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
import { CanvasEventsWithData, EventIdToUniqueEvent, MostData } from './model/Analytics';
import { getAllTimeslots, Timeslot } from './model/Timeslot';

import ClassAnalytics from './pages/ClassAnalytics';
import ClassesList from './pages/ClassesList';
import EventAnalytics from './pages/EventAnalytics';
import Heatmap from './pages/Heatmap';
import Login from './pages/Login';
import Logout from './pages/Logout';
import MetaStats from './pages/MetaStats';

interface AppState extends AnalyticsContextType {
	loading: boolean;
}

export default class App extends React.Component<any, AppState> {

	constructor(props: any) {
		super(props);
		this.state = {
			loading: true,
			timeslots: new BehaviorSubject<Timeslot[] | null>(null),
			canvasEventsWithData: new BehaviorSubject<CanvasEventsWithData | null>(null),
			mostData: new BehaviorSubject<MostData | null>(null)
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

				const assignmentIdMap: EventIdToUniqueEvent = {};
				for (const canvasClass of Object.keys(uniqueEvents)) {
					const assignments = uniqueEvents[canvasClass];

					for (const assignment of assignments) {
						assignmentIdMap[assignment._id] = assignment;
					}
				}

				// Calculate the timeslots associated with a assignment
				const eventsWithData: CanvasEventsWithData = {};
				for (const timeslot of timeslots) {
					const canvasInfo = assignmentIdMap[timeslot.classId];
					if (!canvasInfo) {
						// console.log('No canvas info for', timeslot.classId);
						continue;
					}

					if (!eventsWithData[canvasInfo.className]) {
						eventsWithData[canvasInfo.className] = {};
					}

					if (!eventsWithData[canvasInfo.className][canvasInfo._id]) {
						const extraInfo = {
							timeslots: [],
							stats: {
								min: 0,
								max: 0,
								average: 0,
								userDurations: {}
							}
						};
						eventsWithData[canvasInfo.className][canvasInfo._id] = Object.assign({}, canvasInfo, extraInfo);
					}

					eventsWithData[canvasInfo.className][canvasInfo._id].timeslots.push(timeslot);
				}

				// Calculate stats

				let mostUsers = 0;
				let mostClass = '';
				let mostEvent = '';

				for (const className of Object.keys(eventsWithData)) {
					for (const eventId of Object.keys(eventsWithData[className])) {

						const event = eventsWithData[className][eventId];

						let totalDuration = 0;
						const userDurations: { [user: string]: number } = {};
						for (const timeslot of event.timeslots) {
							if (!timeslot.end) {
								continue;
							}

							if (!userDurations[timeslot.user]) {
								userDurations[timeslot.user] = 0;
							}
							const duration = timeslot.end.diff(timeslot.start);
							totalDuration += duration;
							userDurations[timeslot.user] += duration;
						}

						const durations = Object.values(userDurations);

						event.stats.min = Math.min(...durations);
						event.stats.max = Math.max(...durations);
						event.stats.average = totalDuration / durations.length;
						event.stats.userDurations = userDurations;

						// Debug to find out which event to demo
						if (durations.length > mostUsers) {
							mostUsers = durations.length;
							mostClass = className;
							mostEvent = event.name;
						}
					}
				}

				console.log('Most event', mostUsers, mostClass, mostEvent);
				console.log('events with data', eventsWithData);

				this.state.canvasEventsWithData.next(eventsWithData);
				this.state.mostData.next({
					userCount: mostUsers,
					className: mostClass,
					eventName: mostEvent
				});
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
						'canvasEventsWithData',
						'mostData'
					])}
				>
					<div className={styles.appContainer}>
						<Navbar className={styles.navbar} />
						<div className={styles.routeContainer}>
							<Switch>
								<Route exact={true} path='/' render={this.redirectToDefault} />
								<Route path='/login' component={Login} />
								<Route path='/logout' component={Logout} />
								<PrivateRoute path='/heatmap' component={Heatmap} />
								<PrivateRoute path='/classes/:className/:eventId' component={EventAnalytics} />
								<PrivateRoute path='/classes/:className' component={ClassAnalytics} />
								<PrivateRoute path='/classes' component={ClassesList} />
								<PrivateRoute path='/meta' component={MetaStats} />
								<Route render={this.redirectToDefault} />
							</Switch>
						</div>
					</div>
				</AnalyticsContext.Provider>
			);
		}
	}
}
