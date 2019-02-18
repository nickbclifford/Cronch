/* tslint:disable:variable-name */
import * as React from 'react';

interface WithNavigationOptions {
	navigationOptions?: any;
}

export default function withContextFactory<T, K extends string>(ContextComponent: React.Context<T>, contextPropKey: K) {
	return function withSpecific<P>(
		Component: React.ComponentType<P & {[key in K]: T}> & WithNavigationOptions
	) {
		const sfc: React.FunctionComponent<P> & WithNavigationOptions = props => (
			<ContextComponent.Consumer>
				{context => <Component {...props} {...{[contextPropKey]: context} as {[key in K]: T}} />}
			</ContextComponent.Consumer>
		);

		// Pass on possible React Navigation options
		const options = Component.navigationOptions;
		if (typeof options !== 'undefined') {
			sfc.navigationOptions = options;
		}
		return sfc;
	};
}
