import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

class Landing extends React.Component<RouteComponentProps> {

	// TODO: redirect to battle plan if logged in already

	render() {
		return <p>hey you should go login</p>;
	}

}

export default withRouter(Landing);
