import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MyMICDS, { CanvasEvent } from '../common/MyMICDS';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import DisplayAssignments from '../components/DisplayAssignments';

interface BattlePlanProps extends NavigationScreenProps {
	getEditMode: () => boolean;
	toggleEditMode: () => void;
}

interface BattlePlanState {
	assignments: CanvasEvent[];
	editMode: boolean;
}

export default class BattlePlan extends React.Component<BattlePlanProps, BattlePlanState> {

	static navigationOptions = createNavigationOptions<BattlePlanProps>('Battle Plan', ({ navigation }) => {
		const get: () => boolean = navigation.getParam('getEditMode') || (() => false);
		const onPress = () => {
			const toggle = navigation.getParam('toggleEditMode');
			console.log('should we toggle?');
			if (toggle) {
				console.log('yes!!!');
				toggle();
			}
		};
		return {
			headerRight: <Button title={get() ? 'Done' : 'Edit'} onPress={onPress} />
		};
	});

	// static navigationOptions = {
	// 	// header: null
	// 	title: 'Battle Plan'
	// 	headerLeft: ()
	// 	// headerRight: <Button title='Attack' onPress={BattlePlan.attack} />
	// };

	constructor(props: any) {
		super(props);
		this.state = { assignments: [], editMode: false };
	}

	componentDidMount() {

		const getEditMode = () => {
			return this.state.editMode;
		}

		const toggleEditMode = () => {
			console.log('toggle edit mode!!!');
			this.setState({ editMode: !this.state.editMode });
		};

		this.props.navigation.setParams({ getEditMode, toggleEditMode });

		MyMICDS.canvas.getEvents().subscribe(events => {
			this.setState({
				assignments: events.hasURL ? events.events : []
			});
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>{this.state.editMode.toString()}</Text>
				<DisplayAssignments
					navigation={this.props.navigation}
					assignments={this.state.assignments}
					headers={false}
					sort={false}
					reorder={this.state.editMode}
					containerStyle={styles.assignmentListContainer}
				/>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		height: '100%'
		// paddingBottom: 64
	},
	assignmentListContainer: {
		paddingTop: 16,
		marginBottom: 32
	}
});
