import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import { UniqueEventWithData } from '../model/Analytics';
import listStyles from './ClassList.module.scss';

export interface EventAnalyticsRouteParams {
	className: string;
	eventId: string;
}

interface EventAnalyticsState {
	event: UniqueEventWithData | null;
}

class EventAnalytics extends React.Component<RouteComponentProps<EventAnalyticsRouteParams> & WithAnalyticsContextProps, EventAnalyticsState> {

	constructor(props: any) {
		super(props);
		this.state = { event: null };
	}

	componentDidMount() {
		this.props.analyticsContext.canvasEventsWithData.subscribe(
			canvasEvents => {
				if (canvasEvents) {
					const className = this.props.match.params.className;
					const eventId = this.props.match.params.eventId;

					if (!canvasEvents[className]) {
						this.props.history.push('/classes');
						return;
					}

					if (!canvasEvents[className][eventId]) {
						this.props.history.push(`/classes/${className}`);
						return;
					}

					this.setState({ event: canvasEvents[className][eventId] });
				} else {
					this.setState({ event: null });
				}
			},
			err => alert(`Get Assignment Error! ${err.message}`)
		);
	}

	render() {
		return (
			<div className='container'>
				<h1 className={listStyles.header}>{this.state.event ? this.state.event.name : 'Assignment Analytics'}</h1>
			</div>
		);
	}
}

export default withAnalyticsContext(EventAnalytics);
