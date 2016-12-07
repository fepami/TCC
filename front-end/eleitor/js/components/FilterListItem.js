import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from './TouchableElement';

export default class FilterListItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isChecked: this.props.isChecked
		}
	}

	render() {
		const isCheckedIcon = this.state.isChecked ? 'md-radio-button-on' : 'md-radio-button-off';
		const isCheckedColor = this.state.isChecked ? 'limegreen' : 'black';

		return(
			<TouchableElement onPress={this.onSelectFilter.bind(this)}>
				<View style={styles.cell}>
					<Icon name={isCheckedIcon} size={20} style={{alignSelf: 'center', marginHorizontal: 10}} color={isCheckedColor} />
					<Text style={styles.text}>{this.props.title}</Text>
				</View>
			</TouchableElement>
		)
	}

	onSelectFilter() {
		this.setState({isChecked: !this.state.isChecked});
		this.props.onSelectFilter(this.props.title);
	}
}

const styles = StyleSheet.create({
	cell: {
		paddingVertical: 5,
		flexDirection: 'row'
	},
	text: {
		flex: 1, 
		alignSelf: 'center'
	}
});