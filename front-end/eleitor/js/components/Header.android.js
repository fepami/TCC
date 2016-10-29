import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	ToolbarAndroid,
	StatusBar,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasPreviousState: this.props.navigator.getCurrentRoutes().length !== 1
		}
		this.onIconClicked = this.onIconClicked.bind(this);
	}

	render() {
		const {leftItem} = this.props;
		const icon = leftItem ? leftItem.icon : this.state.hasPreviousState ? 'md-arrow-back' : 'md-menu';
		const actions = this.props.actions;

		const onActionSelected = position => {
			if (actions[position] && actions[position].onActionSelected) {
				actions[position].onActionSelected();
			}
		}
		return (
			<View 
				style={[styles.toolbarContainer, this.props.style]}
				elevation={4}>
				<Icon.ToolbarAndroid
					navIconName={icon}
					onIconClicked={this.onIconClicked}
					title={this.props.title}
					contentInsetEnd={56}
					actions={this.props.actions}
					onActionSelected={onActionSelected}
					style={styles.toolbar}>
					{this.props.children}
				</Icon.ToolbarAndroid>
			</View>
		)
	}

	static contextTypes = {
		openDrawer: React.PropTypes.func,
	}

	onIconClicked() {
		if(this.props.leftItem){
			this.props.leftItem.onPress();
		} else if(this.state.hasPreviousState){
			this.props.navigator.pop();
		} else {
			this.context.openDrawer();
		}
	}
}

const STATUS_BAR_HEIGHT = Platform.Version >= 19 ? StatusBar.currentHeight : 0;
const HEADER_HEIGHT = 56 + STATUS_BAR_HEIGHT;

const styles = StyleSheet.create({
	toolbarContainer: {
		paddingTop: STATUS_BAR_HEIGHT
	},
	toolbar: {
		height: HEADER_HEIGHT - STATUS_BAR_HEIGHT,
	},
});