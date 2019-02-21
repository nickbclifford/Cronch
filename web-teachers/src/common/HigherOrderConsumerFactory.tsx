/* tslint:disable:variable-name */
import * as React from 'react';

export default function withContextFactory<T, K extends string>(ContextComponent: React.Context<T>, contextPropKey: K) {
	return function withSpecific<P>(
		Component: React.ComponentType<P & {[key in K]: T}>
	) {
		const sfc: React.FunctionComponent<P> = props => (
			<ContextComponent.Consumer>
				{context => <Component {...props} {...{[contextPropKey]: context} as {[key in K]: T}} />}
			</ContextComponent.Consumer>
		);
		return sfc;
	};
}
