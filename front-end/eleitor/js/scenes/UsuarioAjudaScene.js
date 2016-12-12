import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	Text
} from 'react-native';
import Header from '../components/Header';
import TouchableElement from '../components/TouchableElement';
import TutorialScene from './TutorialScene';

export default class UsuarioAjudaScene extends Component {
	render(){
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Ajuda' />
				<ScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<Text style={styles.h1}>Bem-vindo ao aplicativo e-leitor!</Text>
						<Text/>
						<View style={styles.box}>
							<TouchableElement onPress={this.onTutorialPress.bind(this)} style={styles.button}>
								<Text style={{fontWeight: 'bold', color: 'white'}}>Ver o tutorial novamente</Text>
							</TouchableElement>
						</View>	
						<Text style={styles.h2}>1 - O que é a barra verde/vermelha no perfil do político e na descrição da proposta?</Text>
						<Text>Essa é a barra de aprovação do político ou da proposta. Ela mostra a proporção de votos contra e à favor do político ou da proposta.</Text>
						<Text>Quanto mais verde, mais votos à favor foram recebidos. E quanto mais vermelha, mais votos contra foram recebidos.</Text>
						<Text/>
						<Text style={styles.h2}>2 - O que são os rankings de políticos e de propostas?</Text>
						<Text>Todo político e proposta possui um índice de aprovação de acordo com os votos à favor e contra que recebem.</Text>
						<Text>É através desse índice de aprovação que tanto os políticos quanto as propostas podem ser rankeados.</Text>
						<Text>Ao abrir a tela de rankings, a ordenação será feita de acordo com os melhores aprovados (mais votos à favor), entretanto é possível mudar essa ordenação para os piores aprovados (mais votos contra) trocando o tipo de ranking nos filtros da página.</Text>
						<Text/>
						<Text style={styles.h2}>3 - Para que serve a estrela no perfil do político?</Text>
						<Text>A estrela corresponde à ação de "Seguir" o político, isto é, quando ela está preenchida o político em questão será adicionado à sua lista de "Políticos seguidos", e aparecerá na tela correspondente a esta listagem.</Text>
						<Text/>
						<Text style={styles.h2}>4 - Para que serve a tela "Seguindo"?</Text>
						<Text>Esta tela mostra todos os políticos que foram incluídos na sua lista de "Políticos seguidos" e serve como um atalho para que você possa acompanhar mais facilmente os políticos de sua preferência.</Text>
						<Text>Durante eleições esta lista também se faz útil como meio de visualizar rapidamente os políticos em que você pretende votar, tendo acesso às suas propostas, informações e número do candidato.</Text>
						<Text/>
						<Text style={styles.h2}>5 - Por que só existem Prefeitos e Vereadores nesse aplicativo?</Text>
						<Text>A primeira versão deste aplicativo foi lançada com foco nas Eleições de 2016, que contemplavam apenas Prefeitos e Vereadores.</Text>
						<Text>Entretanto, gradativamente os outros cargos serão adicionados nas próximas versões.</Text>
						<Text/>
					</View>
				</ScrollView>
			</View>
		)
	}

	onTutorialPress() {
		this.props.navigator.push({component: TutorialScene, passProps: {showButton: false}});
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
	},
	box: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		flex: 1,
		height: 40,
		marginTop: 10,
		marginBottom: 20,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#33CCCC'
	}
})