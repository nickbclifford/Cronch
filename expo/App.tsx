import bind from 'bind-decorator';
import * as React from 'react';
import { Alert } from 'react-native';
import { combineLatest, Subject} from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import Sentry from 'sentry-expo';

import { AssignmentContext, AssignmentContextType } from './common/AssignmentContext';
import { saveBattlePlanTasks } from './common/BattlePlanTask';
import MyMICDS from './common/MyMICDS';
import { OnLoginContext, OnLoginContextType } from './common/OnLoginContext';
import Task, { createCustomTask } from './common/Task';
import { getUserBattlePlanTasks } from './common/User';
import { pickProps } from './common/Utils';
import AppContainer from './Navigation';

// Sentry error tracking
// Sentry.enableInExpoDevelopment = true;
Sentry.config('https://cfb0dd6414524ac39d87a8fac2bd55af@sentry.io/1396954').install();

export default class App extends React.Component<{}, AssignmentContextType & OnLoginContextType> {

	savePlan = new Subject<Task[]>();

	constructor(props: {}) {
		super(props);

		this.state = {
			loggedIn: () => {
				this.state.onLoggedIn.next();
			},
			onLoggedIn: new Subject(),
			assignments: [],
			onAssignmentsChange: new Subject(),
			updateAssignments: this.updateNewAssignments,
			appendAssignment: newAssignment => {
				const newAssignments = this.state.assignments;

				// Do not allow multiple of one assignment to be added
				if (!this.state.assignments.find(a => a._id === newAssignment._id)) {
					newAssignments.push(newAssignment);
					this.updateNewAssignments(newAssignments);
				}
			},
			deleteAssignment: id => {
				const newAssignments = this.state.assignments.filter(assignment => assignment._id !== id);
				this.updateNewAssignments(newAssignments);
			}
		};
	}

	@bind
	private updateNewAssignments(newAssignments: Task[], triggerSavePlan = true) {
		// Submit to backend 5 seconds after last change
		if (triggerSavePlan) {
			this.savePlan.next(newAssignments);
		}
		this.setState({ assignments: newAssignments });
		this.state.onAssignmentsChange.next(newAssignments);
	}

	componentDidMount() {
		MyMICDS.errors.subscribe(err => {
			Sentry.captureException(err);
			Alert.alert('MyMICDS Error', err.message);
		});

		this.state.onLoggedIn.pipe(
			tap(() => {
				console.log(MyMICDS.auth.snapshot);
			}),
			switchMap(() => combineLatest(
				MyMICDS.canvas.getEvents(),
				getUserBattlePlanTasks()
			))
		).subscribe(
			([canvasRes, tasks]) => {
				if (!canvasRes.hasURL) {
					return;
				}
				const events = canvasRes.events;

				tasks.sort((a, b) => a.planOrder - b.planOrder);

				const assignments: Task[] = [];
				for (const task of tasks) {
					const assignment = events.find(e => e._id === task.taskId);
					if (typeof assignment === 'undefined') {
						assignments.push(createCustomTask(task.taskId));
					} else {
						assignments.push(assignment);
					}
				}

				this.updateNewAssignments(assignments, false);
			},
			err => {
				Sentry.captureException(err);
				Alert.alert('Error Getting Battle Plan', err.message);
			}
		);

		this.savePlan.pipe(
			debounceTime(3000),
			switchMap(tasks => saveBattlePlanTasks(tasks.map(t => t._id)))
		).subscribe(
			() => console.log('Saved Battle Plan'),
			err => {
				Sentry.captureException(err);
				Alert.alert('Saving Battle Plan Error', err.message);
			}
		);
	}

	render() {
		const assignmentState: AssignmentContextType = pickProps(this.state, [
			'assignments',
			'onAssignmentsChange',
			'updateAssignments',
			'appendAssignment',
			'deleteAssignment'
		]);
		const onLoginState: OnLoginContextType = pickProps(this.state, ['loggedIn', 'onLoggedIn']);

		return (
			<AssignmentContext.Provider value={assignmentState}>
				<OnLoginContext.Provider value={onLoginState}>
					<AppContainer />
				</OnLoginContext.Provider>
			</AssignmentContext.Provider>
		);
	}
}
