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
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	ViewStyle
} from 'react-native';
import DraggableFlatList, { RenderItemInfo } from 'react-native-draggable-flatlist';
import { Icon } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';
import { CanvasEvent } from '../common/MyMICDS';
import { NEUTRAL, typography } from '../common/StyleGuide';
import { humanReadableTimeUntil } from '../common/Utils';

type SectionedAssignments = Array<{ title: number, data: CanvasEvent[] }>;

interface DisplayAssignmentsProps extends NavigationScreenProps {
	assignments: CanvasEvent[];
	containerStyle?: StyleProp<ViewStyle>;
	itemStyle?: StyleProp<ViewStyle>;
	paddingTop?: number;
	paddingRight?: number;
	paddingBottom?: number;
	paddingLeft?: number;
	headers: boolean;
	onAssignmentClick?: (assignment: CanvasEvent) => void;
	sort?: boolean;
	reorder?: boolean;
	onReorder?: (assignments: CanvasEvent[]) => void;
}

interface DisplayAssignmentsState {
	sectionedAssignments: SectionedAssignments;
}

interface GroupedAssignments {
	[timestampDue: number]: CanvasEvent[];
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
			const assignments = this.sortAssignments(this.props.assignments);

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
		}
	}

	private sortAssignments(assignments: CanvasEvent[]) {
		return assignments
			.filter(a => a.end.valueOf() > Date.now())
			.sort((a, b) => a.end.unix() - b.end.unix());
	}

	// Allows React Native to cache each item's position in the list (not used as a sorting key though)
	@bind
	private getCacheKey(item: CanvasEvent) {
		return item._id;
	}

	@bind
	private renderSectionHeader(info: { section: SectionListData<string> }) {
		console.log('buh', info);
		if (!this.props.headers) {
			return null;
		}
		const itemStyles = StyleSheet.create({
			container: {
				marginTop: 32,
				marginRight: this.props.paddingRight,
				marginLeft: this.props.paddingLeft,
				marginBottom: 16
			}
		});

		const due = moment(info.section.title);
		const humanDate = humanReadableTimeUntil(due);

		return (
			<View style={itemStyles.container}>
				<Text style={typography.h1}>Due {humanDate}</Text>
			</View>
		);
	}

	@bind
	private renderAssignment(props: SectionListRenderItemInfo<CanvasEvent> | RenderItemInfo<CanvasEvent>) {
		const assignment = props.item;
		const itemStyles = StyleSheet.create({
			container: {
				display: 'flex',
				flexDirection: 'row',
				marginRight: this.props.paddingRight,
				marginLeft: this.props.paddingLeft,
				marginBottom: 8,
				padding: 8,
				borderRadius: 5,
				backgroundColor: assignment.class.color
			},
			moveIconContainer: {
				display: 'flex',
				justifyContent: 'center',
				marginRight: 8
			},
			assignmentContainer: {
				// flexGrow: 1
			},
			title: {
				color: assignment.class.textDark ? NEUTRAL[900] : NEUTRAL[100]
			},
			class: {
				color: assignment.class.textDark ? NEUTRAL[700] : NEUTRAL[300]
			},
			addContainer: {
				display: 'flex',
				flexDirection: 'column'
			}
		});

		// tslint:disable:no-unnecessary-initializer
		let moveHandler: (() => void) | undefined = undefined;
		// tslint:disable:no-unnecessary-initializer
		let moveEndHandler: (() => void) | undefined = undefined;

		if (this.shouldReorder) {
			moveHandler = (props as RenderItemInfo<CanvasEvent>).move;
			moveEndHandler = (props as RenderItemInfo<CanvasEvent>).moveEnd;
		}

		return (
			<View style={this.props.itemStyle}>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={this.handleAssignmentPress(assignment)}
				>
					<View style={itemStyles.container}>
						{this.shouldReorder && (
							<TouchableWithoutFeedback
								hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
								onPressIn={moveHandler}
								onPressOut={moveEndHandler}
							>
								<View style={itemStyles.moveIconContainer}>
									<Icon
										name='bars'
										type='font-awesome'
										size={20}
										color={assignment.class.textDark ? NEUTRAL[900] : NEUTRAL[100]}
									/>
								</View>
							</TouchableWithoutFeedback>
						)}
						<View style={itemStyles.assignmentContainer}>
							<Text
								style={[typography.h3, itemStyles.class]}
								numberOfLines={1}
								ellipsizeMode='tail'
							>
								{assignment.class.name}
							</Text>
							<Text
								style={[typography.h2, itemStyles.title]}
								numberOfLines={1}
								ellipsizeMode='tail'
							>
								{assignment.title}
							</Text>
						</View>
						{this.shouldReorder && (
							<TouchableWithoutFeedback
								hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
								onPressIn={moveHandler}
								onPressOut={moveEndHandler}
							>
								<View style={itemStyles.moveIconContainer}>
									<Icon
										name='trash'
										type='font-awesome'
										size={20}
										color={assignment.class.textDark ? NEUTRAL[900] : NEUTRAL[100]}
									/>
								</View>
							</TouchableWithoutFeedback>
						)}
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	@bind
	private handleAssignmentPress(assignment: CanvasEvent) {
		return () => {
			if (this.props.onAssignmentClick) {
				this.props.onAssignmentClick(assignment);
			}
		};
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
				/>
			);
		}
	}

}
