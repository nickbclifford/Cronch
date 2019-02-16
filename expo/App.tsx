import bind from 'bind-decorator';
import * as React from 'react';
import { Alert } from 'react-native';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import { AssignmentContext, AssignmentContextType } from './common/AssignmentContext';
import { saveBattlePlanTasks } from './common/BattlePlanTask';
import MyMICDS from './common/MyMICDS';
import Task, { createCustomTask } from './common/Task';
import { getUserBattlePlanTasks } from './common/User';
import AppContainer from './Navigation';

interface GlobalAppState extends AssignmentContextType { }

export default class App extends React.Component<{}, GlobalAppState> {

	savePlan = new Subject<Task[]>();

	constructor(props: {}) {
		super(props);

		this.state = {
			assignments: [],
			updateAssignments: this.updateNewAssignments,
			appendAssignment: newAssignment => {
				const newAssignments = this.state.assignments;
				newAssignments.push(newAssignment);
				this.setState({ assignments: newAssignments });
				this.updateNewAssignments(newAssignments);
			},
			deleteAssignment: id => {
				const newAssignments = this.state.assignments.filter(assignment => assignment._id !== id);
				this.setState({ assignments: newAssignments });
				this.updateNewAssignments(newAssignments);
			}
		};
	}

	@bind
	private updateNewAssignments(newAssignments: Task[]) {
		// Submit to backend 5 seconds after last change
		this.savePlan.next(newAssignments);
		this.setState({ assignments: newAssignments });
	}

	componentDidMount() {
		MyMICDS.errors.subscribe(err => {
			Alert.alert('MyMICDS Error', err.message);
		});

		combineLatest(
			MyMICDS.canvas.getEvents(),
			getUserBattlePlanTasks()
		).subscribe(
			([canvasRes, tasks]) => {
				if (!canvasRes.hasURL) { return; }
				const events = canvasRes.events;

				const assignments: Task[] = [];
				for (const task of tasks) {
					const assignment = events.find(e => e._id === task.taskId);
					if (typeof assignment === 'undefined') {
						assignments.push(createCustomTask(task.taskId));
					} else {
						assignments.push(assignment);
					}
				}

				this.setState({ assignments });
			},
			err => Alert.alert('Battle Plan Error', `Error getting battle plan! ${err.message}`)
		);

		this.savePlan.pipe(
			debounceTime(5000),
			switchMap(tasks => saveBattlePlanTasks(tasks.map(t => t._id)))
		).subscribe(
			() => console.log('saved battle plan'),
			err => Alert.alert('Saving Battle Plan Error', err.message)
		);
	}

	render() {
		return (
			<AssignmentContext.Provider value={this.state}>
				<AppContainer />
			</AssignmentContext.Provider>
		);
	}
}
