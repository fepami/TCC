import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	Text
} from 'react-native';
import Header from '../components/Header';

export default class HomeCargosExplicacaoScene extends Component {
	render(){
		let text;
		switch (this.props.title) {
			case 'Presidente':
				text = require('../resources/text/cargoPresidente');
				break;
			case 'Governador':
				text = require('../resources/text/cargoGovernador');
				break;
			case 'Prefeito':
				text = require('../resources/text/cargoPrefeito');
				break;
			case 'Deputados':
				text = require('../resources/text/cargoDeputado');
				break;
			case 'Senadores':
				text = require('../resources/text/cargoSenador');
				break;
			case 'Vereadores':
				text = require('../resources/text/cargoVereador');
				break;
			case 'Poder Judiciário':
				text = require('../resources/text/cargoJudiciario');
			default:
				break;	
		}

		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title={this.props.title} />
				<ScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<Text>{text}</Text>
						<Text/>
					</View>
				</ScrollView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	view: {
		padding: 15,
		flexDirection: 'column',
		flex: 1
	},
	h1: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	h2: {
		fontWeight: 'bold'
	}
})