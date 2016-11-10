import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	TextInput,
	Text
} from 'react-native';
import Header from '../components/Header';

export default class UsuarioProblemaScene extends Component {
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
				<ScrollView style={styles.view}>
					<Text>Digite o seu problema:</Text>	
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
							<Text>Enviar</Text>
						</TouchableElement>
					</View>				
				</ScrollView>
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
				alert("Enviado com sucesso! Entraremos em contato assim que possível.");
				this.refs['problem-input'].clear(0);
			}	
		})
	}
}

const styles = StyleSheet.create({
	view: {
		padding: 15,
		flexDirection: 'column',
		flex: 1
	},
	input: {
		marginVertical: 10, 
		height: 30, 
		borderColor: 'lightgray', 
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
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	}
})