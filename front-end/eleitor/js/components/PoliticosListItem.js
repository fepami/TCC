import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from './TouchableElement';

export default class PoliticosListItem extends Component {
	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.icon}/>
		})
	}

	renderRanking() {
		if (this.props.cellType === 'ranking') {
			return(
				<Text style={styles.ranking}>{this.props.politico.ranking}</Text>
			)
		} else {
			return null;
		}
	}

	render() {
		if (this.props.politico != null) {
			return(
				<TouchableElement onPress={this.props.onPress}>
					<View style={[styles.cell, this.props.style]}>
						{this.renderRanking()}
						<Image
							style={styles.roundedimage}
							source={{uri: this.props.politico.foto_url}} />
						<View style={styles.info}>
							<Text style={styles.h1}>{this.props.politico.nome}</Text>
							<Text>{this.props.politico.cargo}</Text>
							<Text>{this.props.politico.partido}</Text>
						</View>
						{this.renderIcon()}
					</View>
				</TouchableElement>
			)
		} else { 
			return null
		}
	}
}

const styles = StyleSheet.create({
	cell: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		flexDirection: 'row'
	},
	h1: {
		fontWeight: 'bold'
	},
	roundedimage: {
		width: 50, 
		height: 50, 
		borderRadius: 25,
		borderColor: 'black',
		borderWidth: 1,
		alignSelf: 'center'
	},
	info: {
		flexDirection: 'column', 
		flex: 1, 
		paddingHorizontal: 15
	},
	icon: {
		alignSelf: 'center'
	},
	ranking: {
		width: 20,
		color: 'black', 
		paddingRight: 15, 
		alignSelf: 'center'
	}
})