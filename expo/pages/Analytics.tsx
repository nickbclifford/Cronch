import bind from 'bind-decorator';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PureChart from 'react-native-pure-chart';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { from } from 'rxjs';
import * as StyleGuide from '../common/StyleGuide';
import { getUserTimeslots } from '../common/User';

const timeslot = from(getUserTimeslots());

import Hamburger from '../components/Hamburger';

export default class Template extends React.Component<NavigationScreenProps> {

	static navigationOptions = {
		header: null
	};

	state = {
		rawData: null,
		data: [
			{
				seriesName: 'chem',
				data: [
					{x: 'monday', y: 20},
					{x: 'tuesday', y: 50},
					{x: 'wednesday', y: 70}
				],
				color: StyleGuide.PRIMARY[100]
			},
			{
				seriesName: 'history',
				data: [
					{x: 'monday', y: 60},
					{x: 'tuesday', y: 50},
					{x: 'wednesday', y: 70}
				],
				color: StyleGuide.PRIMARY[300]
			},
			{
				seriesName: 'thething',
				data: [
					{x: 'monday', y: 60},
					{x: 'tuesday', y: 50},
					{x: 'wednesday', y: 70}
				],
				color: StyleGuide.PRIMARY[500]
			}
		]
	};

	/*
	componentWillMount() {
		timeslot.subscribe(timeslots => {
			const out = [];

			timeslots.forEach(slot => {
				if (slot.end != null) {
					console.log(slot.classId);
					const difference: number = (slot.end.getTime() - slot.start.getTime()) / 86400000;
					out.push({x: slot.classId, y: difference});
				}
			});

			this.setState({data: out});
		});
	}*/

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.container}>
				<View style={styles.container}>
					<Text>hello</Text>
				</View>
					<PureChart
						type='bar'
						data={this.state.data}
						width={1200}
						height={400}
						showEvenNumberXaxisLabel={false}
						customValueRendender={(index, point) => {
							return (
								<Text style={{textAlign: 'center'}}>{point.y}</Text>
							)
						}}
					/>
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

const mockData = [
	{
		seriesName: 'chem',
		data: [
			{x: 'monday', y: 20},
			{x: 'tuesday', y: 50},
			{x: 'wednesday', y: 70}
		],
		color: StyleGuide.PRIMARY[100]
	},
	{
		seriesName: 'history',
		data: [
			{x: 'monday', y: 60},
			{x: 'tuesday', y: 50},
			{x: 'wednesday', y: 70}
		],
		color: StyleGuide.PRIMARY[300]
	},
	{
		seriesName: 'thething',
		data: [
			{x: 'monday', y: 60},
			{x: 'tuesday', y: 50},
			{x: 'wednesday', y: 70}
		],
		color: StyleGuide.PRIMARY[500]
	}
];
