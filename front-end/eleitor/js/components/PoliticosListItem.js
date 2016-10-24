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
				<View style={styles.cell}>
					<Image
						style={styles.roundedimage}
						source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
					/>
					<View style={styles.info}>
						<Text>{this.props.politico.nome}</Text>
						<Text>{this.props.politico.cargo}</Text>
						<Text>{this.props.politico.partido}</Text>
					</View>
					{this.renderIcon()}
				</View>
			</TouchableElement>
		)
	}
}

const styles = StyleSheet.create({
	cell: {
		paddingHorizontal: 15,
		paddingVertical: 5,
		flexDirection: 'row'
	},
	roundedimage: {
		width: 50, 
		height: 50, 
		borderRadius: 25
	},
	info: {
		flexDirection: 'column', 
		flex: 1, 
		paddingHorizontal: 15
	},
	icon: {
		alignSelf: 'center'
	}

})