import * as React from 'react';
import { StyleSheet, Text, View, Picker, Button } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { range } from 'rxjs';
import bind from 'bind-decorator';

export interface TimerModeSelectionState {
	work: number;
	break: number;
}

export default class TimerModeSelection extends React.Component<NavigationScreenProps, TimerModeSelectionState> {

	static navigationOptions = {
		header: null
	};

	constructor(props: any) {
		super(props);

		this.state = {
			work: 45 * 60 * 1000,
			break: 15 * 60 * 1000
		}
	}

	@bind
	addTimer() {
		this.props.navigation.navigate('Timer', {addCycle: this.state, shouldAddCycle: true});
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
					<Picker
						selectedValue={this.state.work}
						onValueChange={(v) => {
							this.setState({
								work: v
							})
						}}>
						{new Array(12).fill(0).map((n, i) =>
							<Picker.Item key={i} label={`${i * 5} minutes`} value={i * 5 * 60 * 1000}/>
						)}
					</Picker>
					<Picker
						selectedValue={this.state.break}
						onValueChange={(v) => {
							this.setState({
								break: v
							})
						}}>
						{new Array(12).fill(0).map((n, i) => 
							<Picker.Item key={i} label={`${i * 5} minutes`} value={i * 5 * 60 * 1000}/>
						)}
					</Picker>
					<Button title="Add" onPress={this.addTimer}/>
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
