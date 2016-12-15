import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from './TouchableElement';
import dismissKeyboard from 'dismissKeyboard';

export default class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showButton: false,
			hasSearched: false,
			searchText: ''
		}
		this.showButton = this.showButton.bind(this);
		this.hideButton = this.hideButton.bind(this);
		this.clearInput = this.clearInput.bind(this);
	}

	showButton() {
		this.setState({showButton: true});
	}

	hideButton() {
		this.setState({showButton: false, searchText: ''});
		dismissKeyboard();
		if (this.state.hasSearched) {
			this.setState({hasSearched: false})
			this.props.onCancelSearch();
		}
	}

	renderClearIcon() {
		if(this.state.showButton === true) {
			return(
				<TouchableElement onPress={this.clearInput} style={{alignItems: 'center', justifyContent: 'center'}}>
					<Icon name='ios-close-circle-outline' size={20} style={{alignSelf: 'center', marginLeft: 10, marginRight: 10}} color='#525252' />
				</TouchableElement>
			)
		}
	}

	renderButton() {
		if(this.state.showButton === true) {
			return(
				<TouchableElement onPress={this.hideButton} style={{height: 50, alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
					<Text style={{alignSelf: 'center', color: 'white'}}>Cancelar</Text>
				</TouchableElement>
			)
		}
	}

	render() {
		const deviceHeight = Platform.select({
			ios: 28,
			android: 35
		})
		return(
			<View style={{backgroundColor: '#525252', flexDirection: 'row'}}>	
				<View style={{margin: 10, height: 30, borderColor: '#525252', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', flexDirection: 'row', flex: 1}}>	
					<Icon name='ios-search-outline' size={20} style={{alignSelf: 'center', marginLeft: 10, marginRight: 10}} color='#525252' />
					<TextInput 
						ref={'searchbar'}
						style={{height: deviceHeight, flex: 1}}
						placeholder='Buscar' 
						autoCapitalize='none'
						autoCorrect={false}
						enablesReturnKeyAutomatically={true}
						keyboardAppearance='default'
						returnKeyType='search'
						underlineColorAndroid='transparent'
						numberOfLines={1}
						onChangeText={(text) => this.setState({searchText: text})}
						onFocus={this.showButton}
						onSubmitEditing={() => {
							this.props.onSubmitSearch(this.state.searchText)
							this.setState({hasSearched: true})
						}}
						value={this.state.searchText}
						/>
					{this.renderClearIcon()}
				</View>
				{this.renderButton()}
			</View>
		)
	}

	clearInput() {
		this.setState({searchText: ''})
	}
}