import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableNativeFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class MenuItem extends Component{
	render(){
		// const color = this.props.selected ? 'royalblue' : 'rgba(0,0,0,.87)';
		const color = this.props.selected ? '#33CCCC' : 'white';
		return(
			<TouchableNativeFeedback
				onPress={this.props.onPress}>
				<View style={{flexDirection: 'row', height: 48, alignItems: 'center', paddingHorizontal: 16}}>
					<Icon name={this.props.icon} color={color} style={{width: 56}} size={24} />
					<Text style={{flex: 1, fontSize: 16, color: color}}>
						{this.props.title}
					</Text>
				</View>
			</TouchableNativeFeedback>
		)
	}
};