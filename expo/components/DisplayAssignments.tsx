import bind from 'bind-decorator';
import moment from 'moment';
import * as React from 'react';
import {
	SectionList,
	SectionListData,
	SectionListRenderItemInfo,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle
} from 'react-native';
import DraggableFlatList, { OnMoveEndInfo, RenderItemInfo } from 'react-native-draggable-flatlist';
import { NavigationScreenProps } from 'react-navigation';

import { typography } from '../common/StyleGuide';
import Task from '../common/Task';
import { humanReadableTimeUntil } from '../common/Utils';
import DisplayAssignment, { PressHandler } from './DisplayAssignment';

type SectionedAssignments = Array<{ title: number, data: Task[] }>;

interface DisplayAssignmentsProps extends NavigationScreenProps {
	assignments: Task[];
	containerStyle?: StyleProp<ViewStyle>;
	itemStyle?: StyleProp<ViewStyle>;
	paddingTop?: number;
	paddingRight?: number;
	paddingBottom?: number;
	paddingLeft?: number;
	headers: boolean;
	onAssignmentClick?: (assignment: Task) => void;
	sort?: boolean;
	reorder?: boolean;
	onReorder?: (assignments: Task[]) => void;
}

interface DisplayAssignmentsState {
	sectionedAssignments: SectionedAssignments;
}

interface GroupedAssignments {
	[timestampDue: number]: Task[];
}

export default class DisplayAssignments extends React.Component<DisplayAssignmentsProps, DisplayAssignmentsState> {

	static navigationOptions = {
		header: null
	};

	get shouldSort() {
		if (typeof this.props.sort === 'undefined') {
			return true;
		} else {
			return this.props.sort;
		}
	}

	get shouldReorder() {
		if (this.props.headers || typeof this.props.reorder === 'undefined') {
			return false;
		} else {
			return this.props.reorder;
		}
	}

	constructor(props: any) {
		super(props);
		this.state = { sectionedAssignments: [] };
	}

	componentDidUpdate(prevProps: any) {
		if (prevProps.assignments !== this.props.assignments) {
			this.updateAssignments(this.props.assignments);
		}
	}

	private updateAssignments(assignments: Task[]) {
		const sortedAssignments = this.sortAssignments(assignments);

		// Group assignments by the date they are due
		const groupedByDue = sortedAssignments.reduce<GroupedAssignments>((accumulator, currentValue) => {
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
	}

	private sortAssignments(assignments: Task[]) {
		return assignments
			.filter(a => a.end.isSameOrAfter(moment().startOf('day')))
			.sort((a, b) => a.end.unix() - b.end.unix());
	}

	// Allows React Native to cache each item's position in the list (not used as a sorting key though)
	@bind
	private getCacheKey(item: Task) {
		return item._id;
	}

	@bind
	private renderSectionHeader(info: { section: SectionListData<string> }) {
		if (!this.props.headers) {
			return null;
		}
		const itemStyles = StyleSheet.create({
			container: {
				marginTop: 24,
				marginRight: this.props.paddingRight,
				marginLeft: this.props.paddingLeft,
				marginBottom: 16
			}
		});

		const due = moment(info.section.title);
		const humanDate = humanReadableTimeUntil(due);

		return (
			<View style={itemStyles.container}>
				<Text style={typography.h3}>Due {humanDate}</Text>
			</View>
		);
	}

	@bind
	private renderAssignment(props: SectionListRenderItemInfo<Task> | RenderItemInfo<Task>) {
		const assignment = props.item;

		let leftIcon: string | undefined;
		let leftIconOnPress: PressHandler | undefined;

		let rightIcon: string | undefined;
		let rightIconOnPressIn: PressHandler | undefined;
		let rightIconOnPressOut: PressHandler | undefined;

		if (this.shouldReorder) {
			leftIcon = 'trash';
			leftIconOnPress = () => {
				const newAssignments = this.props.assignments.filter(event => event._id !== assignment._id);
				this.updateAssignments(newAssignments);
				if (this.props.onReorder) {
					this.props.onReorder(newAssignments);
				}
			};

			rightIcon = 'bars';
			rightIconOnPressIn = (props as RenderItemInfo<Task>).move;
			rightIconOnPressOut = (props as RenderItemInfo<Task>).moveEnd;
		}

		return (
			<DisplayAssignment
				key={`${props.index}-${assignment._id}`}
				assignment={assignment}
				leftIcon={leftIcon}
				leftIconOnPress={leftIconOnPress}
				rightIcon={rightIcon}
				rightIconOnPressIn={rightIconOnPressIn}
				rightIconOnPressOut={rightIconOnPressOut}
				itemStyle={[styles.assignmentStyle, this.props.itemStyle]}
				paddingRight={this.props.paddingRight}
				paddingLeft={this.props.paddingLeft}
				onAssignmentClick={this.props.onAssignmentClick}
			/>
		);
	}

	@bind
	private handleReorder({ data }: OnMoveEndInfo<Task>) {
		if (this.props.onReorder) {
			let newAssignments: Task[] = [];
			if (data) {
				newAssignments = Object.assign([], data);
			}
			this.props.onReorder(newAssignments);
		}
	}

	render() {
		const padding = {
			paddingTop: this.props.paddingTop,
			paddingBottom: this.props.paddingBottom
		};
		if (this.props.headers) {
			return (
				<SectionList
					renderItem={this.renderAssignment}
					renderSectionHeader={this.renderSectionHeader}
					sections={this.state.sectionedAssignments}
					stickySectionHeadersEnabled={false}
					keyExtractor={this.getCacheKey}
					style={[this.props.containerStyle, padding]}
				/>
			);
		} else {
			let renderAssignments = this.props.assignments;
			if (this.shouldSort) {
				renderAssignments = this.sortAssignments(this.props.assignments);
			}

			return (
				<DraggableFlatList
					data={renderAssignments}
					renderItem={this.renderAssignment}
					keyExtractor={this.getCacheKey}
					style={[this.props.containerStyle, padding]}
					onMoveEnd={this.handleReorder}
				/>
			);
		}
	}

}

const styles = StyleSheet.create({
	assignmentStyle: {
		marginBottom: 8
	}
});
