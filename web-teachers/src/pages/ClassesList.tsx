import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import MyMICDS, { GetUniqueEventsResponse } from '../common/MyMICDS';
import styles from './ClassList.module.scss';

interface ClassesListState {
	classes: string[];
	uniqueEvents: GetUniqueEventsResponse['events'];
}

export default class ClassesList extends React.Component<RouteComponentProps, ClassesListState> {

	constructor(props: any) {
		super(props);
		this.state = { classes: [], uniqueEvents: {} };
	}

	componentDidMount() {
		MyMICDS.canvas.getUniqueEvents().subscribe(({ events: uniqueEvents }) => {
			this.setState({
				classes: Object.keys(uniqueEvents).sort(),
				uniqueEvents
			});
		});
	}

	render() {
		return (
			<div className='container'>
				<h1 className={styles.header}>Classes List</h1>
				<div>
					{this.state.classes.map(uniqueClass => (
						<div key={uniqueClass} className={styles.classContainer}>
							<h4>{uniqueClass === '' ? 'No Class' : uniqueClass}</h4>
						</div>
					))}
				</div>
			</div>
		);
	}
}
