import bind from 'bind-decorator';
import { WebBrowser } from 'expo';
import * as React from 'react';
import { Dimensions, GestureResponderEvent, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import HTML from 'react-native-render-html';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import withAssignmentContext, {	WithAssignmentContextProps } from '../common/AssignmentContext';
import { components, NEUTRAL, PRIMARY, SUCCESS, typography } from '../common/StyleGuide';
import Task from '../common/Task';
import { humanReadableTimeUntil } from '../common/Utils';

interface NavigationParameters {
	assignment: Task;
	neuter: boolean;
}

interface AssignmentDetailsState {
	assignment: Task;
	neuter: boolean;
}

class AssignmentDetails extends React.Component<
	NavigationScreenProps<NavigationParameters> & WithAssignmentContextProps,
	AssignmentDetailsState
> {

	static navigationOptions = ({ navigation }: NavigationScreenProps<NavigationParameters>) => {
		const assignment = navigation.getParam('assignment');
		return {
			title: 'Assignment Details',
			headerStyle: {
				backgroundColor: assignment.class.color
			},
			headerTintColor: assignment.class.textDark ? NEUTRAL[900] : NEUTRAL[100]
		};
	}

	constructor(props: any) {
		super(props);
		this.state = {
			assignment: this.props.navigation.getParam('assignment'),
			neuter: this.props.navigation.getParam('neuter')
		};
	}

	@bind
	private onLinkPress(_: GestureResponderEvent, href: string) {
		WebBrowser.openBrowserAsync(href);
	}

	@bind
	private addToBattlePlan() {
		this.props.assignmentContext.appendAssignment(this.state.assignment);
		this.props.navigation.navigate('BattlePlan');
	}

	@bind
	private markAsCompleted() {
		console.log('Completed assignment!');
	}

	render() {
		const humanDate = humanReadableTimeUntil(this.state.assignment.end);
		const time = this.state.assignment.end.format('h:mm A');

		return (
			<View style={styles.container}>
				<StatusBar
					barStyle={this.state.assignment.class.textDark ? 'dark-content' : 'light-content'}
					backgroundColor={this.state.assignment.class.color}
					animated={true}
				/>
				<SafeAreaView style={styles.safeArea}>
					<ScrollView style={styles.detailsContainer}>
						<Text style={typography.h1}>{this.state.assignment.title}</Text>
						<Text style={typography.h2}>Due {humanDate} at {time}</Text>
						<Divider />
						<HTML
							html={this.state.assignment.desc || '<p>No content for this assignment.</p>'}
							imagesMaxWidth={Dimensions.get('window').width}
							onLinkPress={this.onLinkPress}
						/>
					</ScrollView>
					{!this.state.neuter && (
						<Button
							title='Add to Battle Plan'
							buttonStyle={components.buttonStyle}
							titleStyle={components.buttonText}
							onPress={this.addToBattlePlan}
						/>
					)}
					{/*<Button title='Mark as Completed' onPress={this.markAsCompleted} buttonStyle={styles.checkButton} />*/}
				</SafeAreaView>
			</View>
		);
	}

}

export default withAssignmentContext(AssignmentDetails);

const styles = StyleSheet.create({
	container: {
		// backgroundColor: PRIMARY[500]
	},
	safeArea: {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center'
	},
	detailsContainer: {
		width: '100%',
		padding: 16
	},
	assignmentMeta: {
		// backgroundColor: NEUTRAL[300]
	},
	workButton: {
		backgroundColor: PRIMARY[500],
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0
	},
	checkButton: {
		backgroundColor: SUCCESS[500],
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0
	}
});

/**
 * IMPORTANT NOTE: Do NOT use the StyleSheet API to create styles for tagsStyle and classesStyles.
 * More Info here: https://github.com/archriss/react-native-render-html#styling
 */

// const assignmentHtmlStyles = {
//
// };
