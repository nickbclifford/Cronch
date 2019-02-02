import bind from 'bind-decorator';
import moment from 'moment';
import * as React from 'react';
import {
	SectionList,
	SectionListData,
	SectionListRenderItemInfo,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import { NEUTRAL, typography } from '../common/StyleGuide';
import { humanReadableTimeUntil } from '../common/Utils';

import Hamburger from '../components/Hamburger';

interface BattlePlanState {
	sectionedAssignments: SectionedAssignments;
}

type SectionedAssignments = Array<{ title: number, data: CanvasEvent[] }>;

interface GroupedAssignments {
	[timestampDue: number]: CanvasEvent[];
}

export default class BattlePlan extends React.Component<NavigationScreenProps, BattlePlanState> {

	static navigationOptions = {
		header: null
		// title: 'Battle Plan'
		// headerRight: <Button title='Attack' onPress={BattlePlan.attack} />
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
			const groupedByDue = assignments.reduce<GroupedAssignments>((accumulator, currentValue) => {
				const due = currentValue.end.clone().startOf('day').valueOf();
				if (!accumulator[due]) {
					accumulator[due] = [];
				}
				accumulator[due].push(currentValue);
				return accumulator;
			}, {});

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
				marginTop: 48,
				marginLeft: 16,
				marginRight: 16,
				marginBottom: 16
			}
		});

		const due = moment(section.title);
		const humanDate = humanReadableTimeUntil(due);

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
				display: 'flex',
				flexDirection: 'row',
				marginLeft: 16,
				marginRight: 16,
				marginBottom: 16,
				padding: 16,
				borderRadius: 5,
				backgroundColor: assignment.class.color
			},
			assignmentContainer: {
				width: '100%'
			},
			title: {},
			class: {
				color: NEUTRAL[700]
			},
			addContainer: {
				display: 'flex',
				flexDirection: 'column'
			}
		});

		return (
			<TouchableOpacity activeOpacity={0.8} onPress={this.navigateToAssignmentDetails(assignment)}>
				<View style={itemStyles.container}>
					<View style={itemStyles.assignmentContainer}>
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
				</View>
			</TouchableOpacity>
		);
		// <View style={itemStyles.addContainer}>
		// 	<Icon
		// 		name='plus'
		// 		type='font-awesome'
		// 		size={16}
		// 	/>
		// 	<Text>Swipe{'\n'}to Add</Text>
		// </View>
	}

	@bind
	private navigateToAssignmentDetails(assignment: CanvasEvent) {
		return () => {
			this.props.navigation.navigate('AssignmentDetails', { assignment });
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<Hamburger toggle={this.props.navigation.toggleDrawer} />
				<SectionList
					renderItem={this.renderAssignment}
					renderSectionHeader={this.renderAssignmentTitle}
					sections={this.state.sectionedAssignments}
					stickySectionHeadersEnabled={false}
					keyExtractor={this.getCacheKey}
				/>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%'
	},
	container: {
		paddingBottom: 64
	}
});
