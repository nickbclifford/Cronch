import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import { UniqueEventWithData } from '../model/Analytics';
import listStyles from './ClassList.module.scss';

export interface ClassAnalyticsRouteParams {
	className: string;
}

interface ClassAnalyticsState {
	events: UniqueEventWithData[];
}

class ClassAnalytics extends React.Component<RouteComponentProps<ClassAnalyticsRouteParams> & WithAnalyticsContextProps, ClassAnalyticsState> {

	constructor(props: any) {
		super(props);
		this.state = { events: [] };
	}

	componentDidMount() {
		this.props.analyticsContext.canvasEventsWithData.subscribe(
			canvasEvents => {
				if (canvasEvents) {
					console.log('canvas events', canvasEvents);
					const className = this.props.match.params.className;

					if (!canvasEvents[className]) {
						this.props.history.push('/classes');
						return;
					}

					const events = [];
					const eventIds = Object.keys(canvasEvents[className]);
					for (const eventId of eventIds) {
						events.push(canvasEvents[className][eventId]);
					}

					events.sort((a, b) => a.end.valueOf() - b.end.valueOf());

					this.setState({ events });
				} else {
					this.setState({ events: [] });
				}
			},
			err => alert(`Get Classes Error! ${err.message}`)
		);
	}

	render() {
		return (
			<div className='container'>
				<h1 className={listStyles.header}>Class Analytics</h1>
				<div>
					{this.state.events.map(event => (
						<Link key={event._id} to={`/classes/${event.className}/${event._id}`} className={listStyles.link}>
							<div className={listStyles.itemContainer}>
								<h4 className={listStyles.className}>{event.name}</h4>
							</div>
						</Link>
					))}
				</div>
			</div>
		);
	}
}

export default withAnalyticsContext(ClassAnalytics);
