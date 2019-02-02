import bind from 'bind-decorator';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import Hamburger from '../components/Hamburger';

export interface TimerState {
}

export default class Timer extends React.Component<NavigationScreenProps, TimerState> {

	static navigationOptions = {
		header: null
	};

	constructor(props: any) {
		super(props);
		this.state = {};
	}

	@bind
	private navigateToBattlePlan() {
		this.props.navigation.navigate('BattlePlan');
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<Button
					title='Create Battle Plan'
					onPress={this.navigateToBattlePlan}
				/>
				<Button
					title='Start'
				/>
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
