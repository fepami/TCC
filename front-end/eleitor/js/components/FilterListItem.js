import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from './TouchableElement';

export default class FilterListItem extends Component {
	render() {
		const isCheckedIcon = this.props.isChecked ? 'md-radio-button-on' : 'md-radio-button-off';
		const isCheckedColor = this.props.isChecked ? 'limegreen' : 'black';

		return(
			<TouchableElement onPress={() => this.props.onSelectFilter(this.props.title)}>
				<View style={styles.cell}>
					<Icon name={isCheckedIcon} size={20} style={{alignSelf: 'center', marginHorizontal: 10}} color={isCheckedColor} />
					<Text style={styles.text}>{this.props.title}</Text>
				</View>
			</TouchableElement>
		)
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