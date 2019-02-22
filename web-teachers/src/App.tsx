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
import { AssignmentIdToCanvasInfo, UniqueClassAssignments, UniqueClassesTimeslots } from './model/Analytics';
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
			uniqueClassAssignments: new BehaviorSubject<UniqueClassAssignments | null>(null),
			timeslots: new BehaviorSubject<Timeslot[] | null>(null),
			assignmentIdToClass: new BehaviorSubject<AssignmentIdToCanvasInfo | null>(null),
			// uniqueClasses: new BehaviorSubject<string[] | null>(null),
			classesWithTimeslots: new BehaviorSubject<string[] | null>(null),
			assignmentsWithTimeslots: new BehaviorSubject<string[] | null>(null)
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

		// Calculate other data once we have both MyMICDS and timeslot data
		combineLatest(
			this.state.uniqueClassAssignments,
			this.state.timeslots
		).subscribe(
			([uniqueClasses, timeslots]) => {
				// for
			}
		);
	}

	@bind
	private setupAnalytics() {
		MyMICDS.canvas.getUniqueEvents().subscribe(
			({ events: uniqueEvents }) => {
				const uniqueCanvasClasses = Object.keys(uniqueEvents).sort();
				this.state.uniqueClassAssignments.next(uniqueEvents);
				// console.log('unique events', uniqueEvents);

				const map: AssignmentIdToCanvasInfo = {};

				for (const canvasClass of uniqueCanvasClasses) {
					const assignments = uniqueEvents[canvasClass];
					console.log('assignments', assignments);
					for (const assignment of assignments) {
						map[assignment._id] = {
							eventName: assignment.name,
							className: canvasClass
						};
					}
				}

				this.state.assignmentIdToClass.next(map);
				console.log('MAP', map);
			},
			err => alert(`Error getting Canvas events! ${err.message}`)
		);

		getAllTimeslots().subscribe(
			timeslots => {
				this.state.timeslots.next(timeslots);
			},
			err => alert(`Error getting Cronch timeslots! ${err.message}`)
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
				<AnalyticsContext.Provider value={pickProps(this.state, [
					'uniqueClassAssignments',
					'timeslots',
					'assignmentIdToClass',
					'classesWithTimeslots',
					'assignmentsWithTimeslots'
				])}>
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
