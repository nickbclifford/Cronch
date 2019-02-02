import { CanvasEvent } from '@mymicds/sdk';
import * as React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import HTML from 'react-native-render-html';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import { NEUTRAL, typography } from '../common/StyleGuide';
import { humanReadableTimeUntil } from '../common/Utils';

interface NavigationParameters {
	assignment: CanvasEvent;
}

interface AssignmentDetailsState {
	assignment: CanvasEvent;
}

export default class AssignmentDetails extends React.Component<
	NavigationScreenProps<NavigationParameters>,
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

	render() {
		const humanDate = humanReadableTimeUntil(this.state.assignment.end);
		const time = this.state.assignment.end.format('h:mm A');
		// const time = this.state.assignment.
		console.log(this.state.assignment.class.color);

		return (
			<View style={styles.container}>
				<ScrollView style={styles.detailsContainer}>
					<Text style={typography.h1}>{this.state.assignment.title}</Text>
					<Text style={typography.h2}>Due {humanDate} at {time}</Text>
					<HTML html={this.state.assignment.desc} imagesMaxWidth={Dimensions.get('window').width} />
				</ScrollView>
				{/*<Button title='Work!' style={styles.workButton} />*/}
			</View>
		);
	}

}

const styles = StyleSheet.create({
	safeArea:  {
		position: 'absolute'
	},
	container: {
		display: 'flex',
		flexDirection: 'column'
	},
	workButton: {
		zIndex: 100
	},
	detailsContainer: {
		padding:  16
	}
});
