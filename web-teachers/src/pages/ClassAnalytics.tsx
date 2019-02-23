import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';

class ClassesAnalytics extends React.Component<RouteComponentProps & WithAnalyticsContextProps> {

	constructor(props: any) {
		super(props);
		this.state = { classes: [] };
	}

	componentDidMount() {
	}

	render() {
		return (
			<p>Class analytics</p>
		);
	}
}

export default withAnalyticsContext(ClassesAnalytics);
