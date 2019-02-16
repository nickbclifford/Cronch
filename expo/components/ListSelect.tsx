import * as React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';

import bind from 'bind-decorator';
import createNavigationOptions from '../common/NavigationOptionsFactory';
import { PRIMARY } from '../common/StyleGuide';

export interface ListSelectProps {
	selectedIndex: number;
	onSelectItem(index: number): void;
	items: Array<{ label: string, value: any }>;
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

	render() {
		return (
			<View style={styles.container}>
				{this.props.items.map((item, i) => (
					<TouchableOpacity onPress={this.selectItemFactory(i)}>
						{ this.props.selectedIndex === i ?
							(<ListItem key={i} title={item.label} checkmark={true}/>) :
							(<ListItem key={i} title={item.label}/>)
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
