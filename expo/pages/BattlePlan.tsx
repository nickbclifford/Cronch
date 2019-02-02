import bind from 'bind-decorator';
import * as React from 'react';
import { Button, FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import { typography, NEUTRAL } from '../common/StyleGuide';

interface BattlePlanState {
	assignments: CanvasEvent[];
}

export default class BattlePlan extends React.Component<NavigationScreenProps, BattlePlanState> {

	static navigationOptions = {
		// header: null
		title: 'Battle Plan',
		headerRight: <Button title='Attack' onPress={() => console.log('buh')} />
	};

	@bind
	static attack() {
		console.log('buh');
	}

	constructor(props: any) {
		super(props);
		this.state = { assignments: [] };
	}

	componentDidMount() {
		MyMICDS.canvas.getEvents().subscribe(events => {
			let assignments = events.events;
			if (!events.hasURL) {
				assignments = [];
			}
			this.setState({
				assignments: assignments
					.filter(a => a.end.valueOf() > Date.now())
					.sort((a, b) => a.end.unix() - b.end.unix())
			});
		});
	}

	// Allows React Native to cache each item's position in the list (not used as a sorting key though)
	@bind
	private getCacheKey(item: CanvasEvent) {
		return item._id;
	}

	@bind
	private renderAssignment({ item: assignment }: ListRenderItemInfo<CanvasEvent>) {

		const itemStyles = StyleSheet.create({
			container: {
				backgroundColor: assignment.class.color
			},
			title: {},
			class: {
				color: NEUTRAL[700]
			},
			button: {}
		});

		return (
			<TouchableOpacity activeOpacity={0.8}>
				<View style={itemStyles.container}>
					<Text
						style={[typography.h3, itemStyles.class]}
						numberOfLines={1}
						ellipsizeMode='tail'
					>
						{assignment.class.name}
					</Text>
					<Text
						style={typography.h2}
						numberOfLines={1}
						ellipsizeMode='tail'
					>
						{assignment.title}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	render() {
		return (
			// <SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<FlatList
						data={this.state.assignments}
						keyExtractor={this.getCacheKey}
						renderItem={this.renderAssignment}
					/>
				</View>
			// </SafeAreaView>
		);
	}

}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%'
	},
	container: {
		// height: '100%'
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
