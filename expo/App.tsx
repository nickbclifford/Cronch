import * as React from 'react';
import { Alert } from 'react-native';
import MyMICDS from './common/MyMICDS';

import AppContainer from './Navigation';

export default class App extends React.Component {

	componentDidMount() {
		MyMICDS.errors.subscribe(err => {
			console.log('buh');
			Alert.alert('Error', err.message);
		});
	}

	render() {
		return (
			<AppContainer/>
		);
	}
}
