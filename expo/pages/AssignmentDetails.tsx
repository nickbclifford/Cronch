import { CanvasEvent } from '@mymicds/sdk';
import bind from 'bind-decorator';
import { WebBrowser } from 'expo';
import * as React from 'react';
import { Dimensions, GestureResponderEvent, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import HTML from 'react-native-render-html';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import withAssignmentContext, {	WithAssignmentContextProps } from '../common/AssignmentContext';
import { NEUTRAL, PRIMARY, SUCCESS, typography } from '../common/StyleGuide';
import { humanReadableTimeUntil } from '../common/Utils';

interface NavigationParameters {
	assignment: CanvasEvent;
}

interface AssignmentDetailsState {
	assignment: CanvasEvent;
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
		this.state = { assignment: this.props.navigation.getParam('assignment') };
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
					<Button title='Add to Battle Plan' onPress={this.addToBattlePlan} buttonStyle={styles.workButton} />
					<Button title='Mark as Completed' onPress={this.markAsCompleted} buttonStyle={styles.checkButton} />
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
		height: '100%',
		display: 'flex',
		flexDirection: 'column'
	},
	detailsContainer: {
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
