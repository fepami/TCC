import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	Text,
	Linking
} from 'react-native';
import Header from '../components/Header';

export default class UsuarioTermosScene extends Component {
	render(){
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Termos de Uso' />
				<ScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<Text style={styles.h1}>Bem-vindo ao aplicativo e-leitor!</Text>
						<Text/>
						<Text>Última modificação: 30 de Novembro de 2016</Text>
						<Text/>
						<Text>Agradecemos por usar nosso aplicativo e-leitor (“Aplicativo”, "e-leitor", "nós", "nos", "nosso").</Text>
						<Text>Ao usar nosso Aplicativo, você está concordando com estes termos. Leia-os com atenção.</Text>
						<Text/>
						<Text style={styles.h2}>1 - DESTINAÇÃO DO APLICATIVO</Text>
						<Text>1.1. O Aplicativo destina-se à conscientização política e engajamento cívico do usuário (doravante “Usuário” ou “Você”), apenas para fins informativos e de entretenimento, excluindo qualquer utilização comercial ou publicitária. O Aplicativo e seu conteúdo não constituem aconselhamento político ou de qualquer natureza, não devendo ser utilizados para tais fins.</Text>
						<Text>1.2. O Aplicativo permite ao Usuário acessar informações de conteúdo oficial sobre indivíduos pertencentes a um partido ("Político") e sobre projetos de lei ("Propostas") propostos por estes.</Text>
						<Text>1.3. Os votos à favor ou contra ("Votos", "Aprovação") Políticos e Propostas, feitos por Você serão identificados como de sua autoria, sendo proibido o anonimato.</Text>
						<Text/>
						<Text style={styles.h2}>2 - CADASTRO</Text>
						<Text>2.1. Para a utilização do Aplicativo, Você deverá se cadastrar, criando um login e uma senha de acesso ou utilizando os seus dados cadastrados no Facebook.</Text>
						<Text>2.2. O cadastro requer que Você informe alguns de seus dados pessoais, tais como nome completo, email, idade, sexo e a cidade e estado em que vota.</Text>
						<Text>2.3. Ao se cadastrar, Você deverá informar dados verdadeiros, que serão de sua exclusiva responsabilidade. Não nos responsabilizamos por dados falsos inseridos no cadastro.</Text>
						<Text>2.4. Alterações no cadastro poderão ser feitas por Você na parte do Aplicativo correspondente ao perfil do Usuário.</Text>
						<Text>2.5. Para se cadastrar sozinho, Você precisa ter ao menos 18 (dezoito) anos completos e ser plenamente capaz e deve fazer uma declaração nesse sentido. Se Você for menor de 18 (dezoito) anos ou necessitar de representação na forma da lei, seus pais ou responsáveis deverão lhe representar ou assistir. Neste caso, eles deverão preencher o seu cadastro e se responsabilizarão integralmente por Você e por seus atos.</Text>
						<Text>2.6. Pessoas físicas e jurídicas são elegíveis à utilização do Aplicativo.</Text>
						<Text/>
						<Text style={styles.h2}>3 - PRIVACIDADE</Text>
						<Text>3.1. Os dados pessoais coletados no cadastro serão utilizados estritamente de forma a gerar estatísticas de uso e análise de padrões de Votos.</Text>
						<Text>3.2. Por se tratar de um Aplicativo aberto à pessoas físicas e jurídicas, os Políticos retratados neste Aplicativo têm livre acesso às informações aqui contidas do mesmo modo que um Usuário comum teria.</Text>
						<Text>3.3. O Aplicativo não publicará e nem divulgará quaisquer informações do usuário sem o seu prévio conhecimento, exceto nos termos ora previstos.</Text>
						<Text>3.4. Ao usar o Aplicativo ou concordar com estes Termos, você consente com a coleta, o uso e análise de seus dados.</Text>
						<Text/>
						<Text style={styles.h2}>4 - SEGURANÇA</Text>
						<Text>4.1. O Usuário concorda e compreende que será responsável por manter a confidencialidade das senhas associadas a qualquer conta que utilize para acessar o Aplicativo.</Text>
						<Text>4.2. Dessa forma, o Usuário declara que será o único responsável por todas as atividades que ocorram na respectiva conta.</Text>
						<Text>4.3. Se tomar conhecimento de qualquer utilização não autorizada da sua senha ou da sua conta, o Usuário deverá nos notificar imediatamente no endereço: <Text style={{color: 'blue', textDecorationLine: 'underline'}} onPress={() => {Linking.openURL('mailto:contato@eleitor.com.br')}}>contato@eleitor.com.br</Text></Text>
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