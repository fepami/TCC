import React, {Component} from 'react';
import {
	Alert,
	StyleSheet,
	View,
	ScrollView,
	TextInput,
	Text
} from 'react-native';
import Header from '../components/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ApiCall from '../api/ApiCall';
import {connect} from 'react-redux';

class UsuarioProblemaScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			textError: false
		}
	}
	render(){
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Reportar um Problema' />
				<KeyboardAwareScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<Text>Encontrou um problema e não consegue resolvê-lo?</Text>
						<Text/>
						<Text style={{paddingBottom: 15}}>Não se preocupe, digite o seu problema no campo abaixo e tentaremos ao máximo solucioná-lo.</Text>	
						<TextInput 
							ref={'problem-input'}
							style={[styles.input, {height: 90, borderColor: this.state.textError ? 'red' : 'lightgray'}]}
							autoCorrect={false}
							keyboardAppearance='default'
							underlineColorAndroid='transparent'
							multiline={true}
							numberOfLines={5}
							onChangeText={(text) => this.setState({text: text})}
							onSubmitEditing={this.onPress.bind(this)}
							/>
						<View style={styles.box}>
							<TouchableElement onPress={this.onPress.bind(this)} style={styles.button}>
								<Text style={{fontWeight: 'bold', color: 'white'}}>Enviar</Text>
							</TouchableElement>
						</View>
					</View>
				</KeyboardAwareScrollView>
			</View>
		)
	}

	onPress() {
		let textError = false;

		if (this.state.text === '') {
			textError = true;
		}

		this.setState({textError: textError}, () => {
			if (!textError) {
				this.callReportarProblema();
			}	
		})
	}

	callReportarProblema(newPhotoURL) {
		var options = {
			report: this.state.text,
			token: this.props.token,
		};
		ApiCall(`reportar_problema`, options, (jsonResponse) => {
			Alert.alert('Enviado com sucesso!', 'Entraremos em contato assim que possível.');
			this.refs['problem-input'].clear(0);
		}, (failedRequest) => {
			Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
		});
	}
}

function mapStateToProps(store) {
	return {
		token: store.token.token
	}
}

export default connect(mapStateToProps)(UsuarioProblemaScene);

const styles = StyleSheet.create({
	view: {
		padding: 15,
		flexDirection: 'column',
		flex: 1
	},
	input: {
		marginVertical: 10, 
		height: 30, 
		borderWidth: 1, 
		borderRadius: 3, 
		backgroundColor: 'white', 
		flexDirection: 'row', 
		flex: 1,
		padding: 5
	},
	box: {
		flex: 1,
		height: 80,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		flex: 1,
		height: 40,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#33CCCC'
	}
})