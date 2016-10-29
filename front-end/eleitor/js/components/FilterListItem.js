import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from '../components/TouchableElement';

export default class FilterListItem extends Component {
	render() {
		const isCheckedStyle = this.props.isChecked ? styles.checked : null;

		return(
			<TouchableElement onPress={(option) => this.props.onSelectFilter(this.props.title)}>
				<View style={styles.cell}>
					<View style={[styles.checkbox, isCheckedStyle]}></View>
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
	},
	checkbox: {
		alignSelf: 'center',
		width: 10,
		height: 10,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: 'black',
		marginHorizontal: 10
	},
	checked: {
		backgroundColor: 'limegreen'
	}
});