import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import PureChart from 'react-native-pure-chart';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { getUserTimeslots } from '../common/User';

import Hamburger from '../components/Hamburger';

export default class Template extends React.Component<NavigationScreenProps> {

	static navigationOptions = {
		header: null
	};

	state = {
		rawData: null,
		data: [
			{
				x: 'monday',
				y: 5,
				color: '#ff0000'
			},
			{
				x: 'monday',
				y: 25,
				color: '#ff0000'
			}
		]
	};

	calculateTotalHours() {
		this.state.data = [];
	}

	componentWillMount() {
		console.log(getUserTimeslots());
	}

	componentWillUpdate() {
		console.log(getUserTimeslots());
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.container}>
					<PureChart type='bar' data={this.state.data} />
				</View>
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

// noinspection JSUnusedLocalSymbols
const mockData = [
	{
		id: 34,
		start: '2019-02-10 05:55:14.603000 +00:00',
		end: '2019-02-10 05:65:14.603000 +00:00',
		name: 'Science'
	},
	{
		id: 34,
		start: '2019-02-10 05:55:14.603000 +00:00',
		end: '2019-02-10 05:65:14.603000 +00:00',
		name: 'Math'
	},
	{
		id: 34,
		start: '2019-02-10 05:55:14.603000 +00:00',
		end: '2019-02-10 06:65:14.603000 +00:00',
		name: 'Science'
	},
	{
		id: 34,
		start: '2019-02-10 05:55:14.603000 +00:00',
		end: '2019-02-10 05:65:14.603000 +00:00',
		name: 'Science'
	}
];
