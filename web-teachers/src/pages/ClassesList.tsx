import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import styles from './ClassList.module.scss';

interface ClassesListState {
	classes: string[];
}

class ClassesList extends React.Component<RouteComponentProps & WithAnalyticsContextProps, ClassesListState> {

	constructor(props: any) {
		super(props);
		this.state = { classes: [] };
	}

	componentDidMount() {
		this.props.analyticsContext.uniqueClasses.subscribe(classes => {
			if (classes) {
				this.setState({ classes });
			} else {
				this.setState({ classes: [] });
			}
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

export default withAnalyticsContext(ClassesList);
