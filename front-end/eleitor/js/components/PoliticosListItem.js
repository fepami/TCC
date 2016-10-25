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

	renderRanking() {
		if (this.props.cell_type === 'ranking') {
			return(
				<Text style={styles.ranking}>{this.props.politico.ranking}</Text>
			)
		} else {
			return null;
		}
	}

	render() {
		return(
			<TouchableElement onPress={this.props.onPress}>
				<View style={styles.cell}>
					{this.renderRanking()}
					<Image
						style={styles.roundedimage}
						source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}} />
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
		height: 70,
		paddingHorizontal: 15,
		paddingVertical: 10,
		flexDirection: 'row'
	},
	roundedimage: {
		width: 50, 
		height: 50, 
		borderRadius: 25,
		borderColor: 'black',
		borderWidth: 1
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