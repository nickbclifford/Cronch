import bind from 'bind-decorator';
import * as React from 'react';
import {
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	View
} from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';

import Hamburger from '../components/Hamburger';

export interface TimerSelectionState {
	assignments: CanvasEvent[];
}

export default class TimerSelection extends React.Component<NavigationScreenProps, TimerSelectionState> {

	static navigationOptions = {
		// title: 'Home',
		// headerStyle: {
		// 	backgroundColor: '#f4511e',
		// },
		// headerTintColor: '#fff',
		// headerTitleStyle: {
		// 	fontWeight: 'bold',
		// }
		header: null
		// drawerLabel: 'Timer'
		// drawerIcon: () => (
		// 	<FontAwesome name="bars" style={styles.menu} />
		// )
	};

	constructor(props: any) {
		super(props);
		this.state = { assignments: [] };
	}

	componentDidMount() {
		this.getTodoAssignments();
	}

	private getTodoAssignments() {
		MyMICDS.canvas.getEvents().subscribe(assignments => {
			if (assignments.events) {
				this.setState({
					assignments: assignments.events
						.filter(a => a.end.valueOf() > Date.now())
						.sort((a, b) => a.end.unix() - b.end.unix())
				});
			}
		});
	}

	// Allows React Native to cache each item's position in the list (not used as a sorting key though)
	@bind
	private getCacheKey(item: CanvasEvent) {
		return item._id;
	}

	@bind
	private renderListItem({ item }: ListRenderItemInfo<CanvasEvent>) {
		const itemStyle: TextStyle = {
			backgroundColor: item.class.color,
			color: item.class.textDark ? '#333' : '#eee',
			borderRadius: 5
		};

		// TODO: Change to be clickable, start timer, etc. (maybe navigates to different component?)
		return (
			<TouchableOpacity style={itemStyle} onPress={this.startTimer}>
				<Text>({item.class.name}) {item.title}</Text>
			</TouchableOpacity>
		);
	}

	@bind
	private startTimer() {
		this.props.navigation.navigate('Timer');
	}

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<View style={styles.container}>
					<Text>This is the Timer!</Text>
					<FlatList data={this.state.assignments} keyExtractor={this.getCacheKey} renderItem={this.renderListItem} />
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
	},
	menu: {
		// position: 'absolute',
		// top: 16,
		// left: 16
	}
});
