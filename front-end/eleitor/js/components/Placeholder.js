import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TouchableElement from '../components/TouchableElement';

export default class Placeholder extends Component {
	render() {
		if (this.props.type == 'search') {
			return(
				<View style={styles.view}>
					<Icon name='find-in-page' color='#575757' size={80}/>
					<Text style={styles.text}>Ops, não encontramos resultados para sua busca.</Text>
				</View>
			)
		} else if (this.props.type == 'follow') {
			return(
				<View style={styles.view}>
					<Icon name='announcement' color='#575757' size={80}/>
					<Text style={styles.text}>Você ainda não está seguindo nenhum político!</Text>
				</View>
			)
		} else if (this.props.type == 'error') {
			return(
				<View style={styles.view}>
					<Icon name='warning' color='#575757' size={80}/>
					<Text style={styles.text}>Desculpe, não foi possível conectar ao servidor.</Text>
					<View style={{flexDirection: 'row'}}>
						<TouchableElement onPress={this.props.onPress} style={styles.button}>
							<Text style={{fontWeight: 'bold', color: 'white'}}>Tentar novamente</Text>
						</TouchableElement>
					</View>
				</View>
			)
		}
	}
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		flexDirection: 'column',
		padding: 30
	},
	button: {
		flex: 1,
		height: 40,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#33CCCC',
		marginTop: 20
	},
	text: {
		fontSize: 18,
		fontWeight: 'bold',
		color:'#575757',
		textAlign:'center',
		paddingTop: 20
	}
})