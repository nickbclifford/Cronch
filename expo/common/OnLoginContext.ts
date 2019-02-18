import * as React from 'react';
import { Subject } from 'rxjs';

import withContextFactory from './HigherOrderConsumerFactory';

export interface WithOnLoginContextProps {
	onLoginContext: OnLoginContextType;
}

export interface OnLoginContextType {
	onLoggedIn: Subject<void>;
	loggedIn: () => void;
}

// tslint:disable-next-line:variable-name
export const OnLoginContext = React.createContext<OnLoginContextType>({
	// tslint:disable:no-empty
	onLoggedIn: new Subject(),
	loggedIn: () => {}
	// tslint:enable:no-empty
});

export default withContextFactory(OnLoginContext, 'onLoginContext');
