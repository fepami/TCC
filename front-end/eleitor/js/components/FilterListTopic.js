import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from './TouchableElement';
import FilterListItem from './FilterListItem';

export default class FilterListTopic extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showOptions: false,
		}
		this.showFilterListItems = this.showFilterListItems.bind(this);
	}

	showFilterListItems() {
		let options = this.props.options;
		const filterListItems = options.map((option, ii) => (
			<FilterListItem
				title={option}
				key={ii}
				isChecked={this.props.selectedOptions.includes(option)}
				onSelectFilter={(option) => this.props.onSelectFilter(option)}
			/>
		));

		if (this.state.showOptions === true) {
			return filterListItems;
		}
	}

	render() {
		return(
			<View style={styles.cell}>
				<TouchableElement onPress={() => this.toggleShowOptions()}>
					<View style={{flexDirection: 'row'}}>
						<Text style={styles.text}>{this.props.title}</Text>
						<Icon name='ios-arrow-down' size={24} style={styles.arrowIcon}/>
					</View>
				</TouchableElement>
				<View style={{flexDirection: 'column'}}>
					{this.showFilterListItems()}
				</View>
			</View>
		)
	}

	toggleShowOptions() {
		this.setState({showOptions: !this.state.showOptions});
	}
}

const styles = StyleSheet.create({
	cell: {
		marginHorizontal: 15,
		paddingVertical: 10,
		borderBottomColor: 'rgba(0,0,0,.87)',
		borderBottomWidth: 1
	},
	text: {
		flex: 1, 
		alignSelf: 'center'
	},
	arrowIcon: {
		alignSelf: 'center'
	}
});