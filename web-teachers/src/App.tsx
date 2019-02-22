import bind from 'bind-decorator';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import styles from './App.module.scss';
import { AnalyticsContext, AnalyticsContextType } from './common/AnalyticsContext';
import MyMICDS from './common/MyMICDS';
import { pickProps } from './common/Utils';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { UniqueClassAssignments, UniqueClassesTimeslots } from './model/Analytics';
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
			uniqueClasses: new BehaviorSubject<string[] | null>(null),
			uniqueClassAssignments: new BehaviorSubject<UniqueClassAssignments | null>(null),
			timeslots: new BehaviorSubject<Timeslot[] | null>(null),
			uniqueClassTimeslots: new BehaviorSubject<UniqueClassesTimeslots | null>(null)
		};
	}

	componentDidMount() {
		MyMICDS.errors.subscribe(err => {
			console.log('error', err);
			alert(`MyMICDS Error ${err.message}`);
		});

		MyMICDS.auth.$.pipe(
			filter(auth => auth !== undefined),
			first()
		).subscribe(() => {
			this.setState({ loading: false });
			setTimeout(this.setupAnalytics);
		});

		/** @todo Do analytics once we have both MyMICDS and timeslot data */
		// combineLatest()
	}

	@bind
	private setupAnalytics() {
		MyMICDS.canvas.getUniqueEvents().subscribe(
			({ events: uniqueEvents }) => {
				this.state.uniqueClasses.next(Object.keys(uniqueEvents).sort());
				this.state.uniqueClassAssignments.next(uniqueEvents);
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
					'uniqueClasses',
					'uniqueClassAssignments',
					'timeslots',
					'uniqueClassTimeslots'
				])}>
					<div className={styles.appContainer}>
						<Navbar />
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
