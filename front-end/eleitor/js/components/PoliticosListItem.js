import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from '../components/TouchableElement';

export default class PoliticosListItem extends Component {
	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.icon}/>
		})
	}

	render() {
		return(
			<TouchableElement onPress={this.props.onPress}>
				<View style={{flexDirection: 'row'}}>
					<Image
						style={{width: 50, height: 50}}
						source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
					/>
					<View style={{flexDirection: 'column', flex: 1}}>
						<Text>{this.props.politico.name}</Text>
						<Text>{this.props.politico.position}</Text>
						<Text>Partido</Text>
					</View>
					{this.renderIcon()}
				</View>
			</TouchableElement>
		)
	}
}

const styles = StyleSheet.create({
	icon: {
		alignSelf: 'center'
	}
})