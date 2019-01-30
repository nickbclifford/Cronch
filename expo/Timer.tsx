import bind from 'bind-decorator';
import * as React from 'react';
import {
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TouchableOpacity,
	TextStyle,
	View
} from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import MyMICDS, { CanvasEvent } from './MyMICDS';

import Hamburger from './Hamburger';

export interface TimerState {
}

export default class Timer extends React.Component<NavigationScreenProps, TimerState> {
	constructor(props: any) {
		super(props);
		this.state = {};
	}

	componentDidMount() {

	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%'
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
