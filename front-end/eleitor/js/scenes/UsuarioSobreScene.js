import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	Text,
	Linking
} from 'react-native';
import Header from '../components/Header';

export default class UsuarioSobreScene extends Component {
	render(){
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Sobre o Aplicativo' />
				<ScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<Text style={styles.h1}>Bem-vindo ao aplicativo e-leitor!</Text>
						<Text/>
						<Text style={styles.h2}>1 - O QUE É</Text>
						<Text>O e-leitor é um aplicativo destinado à conscientização política e engajamento cívico do usuário que apresenta, de uma maneira simples, organizada e fácil de entender, informações sobre a carreira de políticos e projetos de lei propostos por estes.</Text>
						<Text>Qualquer pessoa pode votar à favor ou contra tanto das propostas quanto dos políticos.</Text>
						<Text/>
						<Text style={styles.h2}>2 - OBJETIVOS</Text>
						<Text>O e-leitor possui dois objetivos:</Text>
						<Text>1. Aumentar o conhecimento político dos usuários, para que possam votar e tomar decisões mais conscientemente do que é melhor para si e para a sociedade.</Text>
						<Text>2. Facilitar o acesso à informação, possibilitando um maior acompanhamento do que acontece na política brasileira.</Text>
						<Text/>
						<Text style={styles.h2}>3 - COMO PARTICIPAR</Text>
						<Text>Basta se cadastrar e começar a votar!</Text>
						<Text>Você pode votar em quantos políticos e propostas de projeto de lei quiser, além de poder acompanhar a carreira política de diversos políticos, ler a descrição de propostas na íntegra e conferir a aprovação de cada um deles.</Text>
						<Text/>
						<Text style={styles.h2}>4 - CONTATO</Text>
						<Text>Quer entrar em contato com a gente? Mande um email para: <Text style={{color: 'blue', textDecorationLine: 'underline'}} onPress={() => {Linking.openURL('mailto:eleitor.app@gmail.com')}}>eleitor.app@gmail.com</Text></Text>				
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