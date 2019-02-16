import * as React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import bind from 'bind-decorator';
import { PRIMARY } from '../common/StyleGuide';

export interface ListSelectProps {
	selectedIndex: number;
	onSelectItem(index: number): void;
	items: Array<{ label: string, value: any }>;
	onDelete(index: number): void;
}

export default class ListSelect extends React.Component<ListSelectProps> {

	constructor(props: ListSelectProps) {
		super(props);
	}

	@bind
	selectItemFactory(n: number) {
		return () => {
			this.props.onSelectItem(n);
		};
	}

	@bind
	deleteTimerModeFactory(n: number) {
		return () => {
			this.props.onDelete(n);
		};
	}

	render() {
		// tslint:disable-next-line:variable-name
		const DeleteButton = (props: { deleteIndex: number }) => (
			<TouchableOpacity onPress={this.deleteTimerModeFactory(props.deleteIndex)}>
				<Icon name='cancel'/>
			</TouchableOpacity>
		);

		return (
			<View style={styles.container}>
				{this.props.items.map((item, i) => (
					<TouchableOpacity onPress={this.selectItemFactory(i)}>
						{ this.props.selectedIndex === i ?
							(<ListItem leftElement={<DeleteButton deleteIndex={i}/>} key={i} title={item.label} checkmark={true}/>) :
							(<ListItem leftElement={<DeleteButton deleteIndex={i}/>} key={i} title={item.label}/>)
						}
					</TouchableOpacity>
				))}
			</View>
		);
	}

}

const styles = StyleSheet.create({
	safeArea: {
		height: '100%'
	},
	container: {
		minHeight: 200
	}
});
