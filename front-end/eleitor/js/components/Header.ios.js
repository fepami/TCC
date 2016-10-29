import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Header extends Component {
	constructor(...args) {
		super(...args);
		this.state = {hasPreviousRoute: this.props.navigator.getCurrentRoutes().length !== 1}
	}

	render() {
		const {title, actions} = this.props;
		let {rightItem} = this.props;
		const back = {
			icon: 'ios-arrow-back',
			onPress: this.props.navigator.pop,
		};
		const leftItem = this.props.leftItem ? this.props.leftItem : this.state.hasPreviousRoute? back : null;
		if(!rightItem && actions){
			rightItem = {
				icon: actions[0].iconName,
				onPress: actions[0].onActionSelected
			}
		}
		return (
			<View style={[styles.header, this.props.style]}>
				<View style={styles.leftItem}>
					<ItemWrapperIOS item={leftItem}/>
				</View>
				<View
					accessibilityLabel={title}
					accessibilityTraits="header"
					style={styles.centerItem}>
					{title? (<Text numberOfLines={1} style={[styles.titleText]}>{title}</Text>) : null}
					{this.props.children}
				</View>
				<View style={styles.rightItem}>
					<ItemWrapperIOS item={rightItem}/>
				</View>
			</View>
		);
	}
}

class ItemWrapperIOS extends Component {
	render() {
		const {item, style} = this.props;
		if (!item) {
			return null;
		}

		let content;
		const {title, icon, layout, onPress} = item;

		if (layout !== 'icon' && title) {
			content = (
				<Text style={[styles.itemText, style]}>
					{title.toUpperCase()}
				</Text>
			);
		} else if (icon) {
			// content = <Icon name={icon} color={style.color} size={24} />;
			content = <Icon name={icon} size={24} />;
		}

		return (
			<TouchableOpacity
				accessibilityLabel={title}
				accessibilityTraits="button"
				onPress={onPress}
				style={styles.itemWrapper}>
				{content}
			</TouchableOpacity>
		);
	}
}

var STATUS_BAR_HEIGHT = 20;
var HEADER_HEIGHT = 44 + STATUS_BAR_HEIGHT;

var styles = StyleSheet.create({
	header: {
		backgroundColor: 'white',
		paddingTop: STATUS_BAR_HEIGHT,
		height: HEADER_HEIGHT,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomColor: 'rgba(0,0,0,.87)',
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	titleText: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 20,
	},
	leftItem: {
		flex: 1,
		alignItems: 'flex-start',
	},
	centerItem: {
		flex: 4,
		alignItems: 'center',
		justifyContent: 'center',
	},
	rightItem: {
		flex: 1,
		alignItems: 'flex-end',
	},
	itemWrapper: {
		paddingVertical: 11,
		paddingHorizontal: 15,
	},
	itemText: {
		letterSpacing: 1,
		fontSize: 12,
		color: 'black',
	},
});