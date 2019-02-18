import * as React from 'react';
import withContextFactory from './HigherOrderConsumerFactory';

export interface WithOnLoginContextProps {
	onLoginContext: OnLoginContextType;
}

export interface OnLoginContextType {
	onLoginEvent(callback: () => void): void;
	runEvents(): void;
}

// tslint:disable-next-line:variable-name
export const OnLoginContext = React.createContext<OnLoginContextType>({
	// tslint:disable:no-empty
	onLoginEvent: () => {},
	runEvents: () => {}
	// tslint:enable:no-empty
});

export default withContextFactory(OnLoginContext, 'onLoginContext');
