import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { Accessory, Expression, Headwear, Skin } from '../common/AvatarTypes';
import Cronchy from './Cronchy';

export interface CronchyUserProps {
	user: string | null;
	style?: StyleProp<ViewStyle>;
}

interface CronchyUserState {
	skin: Skin;
	expression: Expression;
	headwear: Headwear[];
	accessories?: Accessory[];
}

export default class CronchyUser extends React.Component<CronchyUserProps, CronchyUserState> {

	componentDidMount() {
		this.updateAvatar();
	}

	componentDidUpdate(prevProps: CronchyUserProps) {
		console.log('component did update', this.props, prevProps);
		if (prevProps.user !== this.props.user /*&& this.props.user !== null*/) {
			this.updateAvatar();
		}
	}

	private updateAvatar() {
		/** @todo Get user's avatar from the database from `this.props.user` */

		this.setState({
			skin: Skin.GreenPlain,
			expression: Expression.OuO,
			headwear: [Headwear.SpongebobGlasses],
			accessories: [Accessory.DiamondSword]
		});

		console.log('state', this.state);
	}

	render() {
		console.log('render state', this.state);
		if (this.state) {
			return (
				<Cronchy
					style={this.props.style}
					skin={this.state.skin}
					expression={this.state.expression}
					headwear={this.state.headwear}
					accessories={this.state.accessories}
				/>
			);
		} else {
			return null;
		}
	}

}
