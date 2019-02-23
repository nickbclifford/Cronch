import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Subscription } from 'rxjs';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import listStyles from './ClassList.module.scss';

interface ClassesListState {
	classes: string[];
}

class ClassesList extends React.Component<RouteComponentProps & WithAnalyticsContextProps, ClassesListState> {

	analyticsSubscription: Subscription | null = null;

	constructor(props: any) {
		super(props);
		this.state = { classes: [] };
	}

	componentDidMount() {
		this.analyticsSubscription = this.props.analyticsContext.canvasEventsWithData.subscribe(
			canvasEvents => {
				if (canvasEvents) {
					this.setState({ classes: Object.keys(canvasEvents).sort().reverse() });
				} else {
					this.setState({ classes: [] });
				}
			},
			err => alert(`Get Classes Error! ${err.message}`)
		);
	}

	componentWillUnmount() {
		if (this.analyticsSubscription) {
			this.analyticsSubscription.unsubscribe();
		}
	}

	render() {
		return (
			<div className='container'>
				<h1 className={listStyles.header}>Classes List</h1>
				<div>
					{this.state.classes.filter(c => c !== '').map(uniqueClass => (
						<Link key={uniqueClass} to={`/classes/${uniqueClass}`} className={listStyles.link}>
							<div className={listStyles.itemContainer}>
								<h4 className={listStyles.className}>{uniqueClass === '' ? 'No Class' : uniqueClass}</h4>
							</div>
						</Link>
					))}
				</div>
			</div>
		);
	}
}

export default withAnalyticsContext(ClassesList);
