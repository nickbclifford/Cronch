import bind from 'bind-decorator';
import moment from 'moment';
import * as React from 'react';
import {
	Button,
	SectionList,
	SectionListData,
	SectionListRenderItemInfo,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import { NEUTRAL, PRIMARY, typography } from '../common/StyleGuide';

interface BattlePlanState {
	sectionedAssignments: SectionedAssignments;
}

type SectionedAssignments = Array<{ title: number, data: CanvasEvent[] }>;

interface GroupedAssignments {
	[timestampDue: number]: CanvasEvent[];
}

export default class BattlePlan extends React.Component<NavigationScreenProps, BattlePlanState> {

	static navigationOptions = {
		// header: null
		title: 'Battle Plan',
		headerRight: <Button title='Attack' onPress={BattlePlan.attack} />
	};

	@bind
	static attack() {
		console.log('buh');
	}

	constructor(props: any) {
		super(props);
		this.state = { sectionedAssignments: [] };
	}

	componentDidMount() {
		MyMICDS.canvas.getEvents().subscribe(events => {
			let assignments = events.events;
			if (!events.hasURL) {
				assignments = [];
			}

			assignments = assignments
				.filter(a => a.end.valueOf() > Date.now())
				.sort((a, b) => a.end.unix() - b.end.unix());

			// Group assignments by the date they are due
			const groupedByDue: GroupedAssignments = assignments.reduce((accumulator: GroupedAssignments, currentValue) => {
				const due = currentValue.end.startOf('day').valueOf();
				if (!accumulator[due]) {
					accumulator[due] = [];
				}
				accumulator[due].push(currentValue);
				return accumulator;
			}, {});

			console.log('grouped by date', groupedByDue);

			const sections = Object.keys(groupedByDue).map(i => parseInt(i, 10)).map(due => {
				return { title: due, data: groupedByDue[due] };
			});

			this.setState({ sectionedAssignments: sections });
		});
	}

	// Allows React Native to cache each item's position in the list (not used as a sorting key though)
	@bind
	private getCacheKey(item: CanvasEvent) {
		return item._id;
	}

	@bind
	private renderAssignmentTitle({ section }: { section: SectionListData<string> }) {
		const itemStyles = StyleSheet.create({
			container: {
				// backgroundColor: PRIMARY[500]
			}
		});

		const due = moment(section.title);
		const humanDate = due.calendar(undefined, {
			sameDay: '[Today]',
			nextDay: '[Tomorrow]',
			nextWeek: 'dddd',
			lastDay: '[Yesterday]',
			lastWeek: '[Last] dddd',
			sameElse: 'MM/DD'
		});

		return (
			<View style={itemStyles.container}>
				<Text style={typography.h1}>Due {humanDate}</Text>
			</View>
		);
	}

	@bind
	private renderAssignment({ item: assignment }: SectionListRenderItemInfo<CanvasEvent>) {

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
					<SectionList
						renderItem={this.renderAssignment}
						renderSectionHeader={this.renderAssignmentTitle}
						sections={this.state.sectionedAssignments}
						stickySectionHeadersEnabled={false}
						keyExtractor={this.getCacheKey}
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
		// flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center'
	}
});
