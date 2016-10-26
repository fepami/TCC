import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from '../components/TouchableElement';
import dismissKeyboard from 'dismissKeyboard';

export default class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show_cancel: false
		}
		this.showCancel = this.showCancel.bind(this);
		this.hideCancel = this.hideCancel.bind(this);
	}

	showCancel() {
		this.setState({show_cancel: true});
	}

	hideCancel() {
		this.setState({show_cancel: false});
		dismissKeyboard();
		this.refs['searchbar'].clear(0);
	}

	renderCancel() {
		if(this.state.show_cancel === true) {
			return(
				<TouchableElement onPress={this.hideCancel} style={{height: 50, alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
					<Text style={{alignSelf: 'center'}}>Cancelar</Text>
				</TouchableElement>
			)
		}
	}

	render() {
		let deviceHeight = Platform.select({
			ios: 28,
			android: 35
		})
		return(
			<View style={{backgroundColor: 'lightgray', flexDirection: 'row'}}>	
				<View style={{margin: 10, height: 30, borderColor: 'lightgray', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', flexDirection: 'row', flex: 1}}>	
					<Icon name='ios-search-outline' size={20} style={{alignSelf: 'center', marginLeft: 10, marginRight: 3}} color='lightgray' />
					<TextInput 
						ref={'searchbar'}
						style={{height: deviceHeight, flex: 1}}
						placeholder='Buscar' 
						autoCapitalize='none'
						autoCorrect={false}
						clearButtonMode='while-editing'
						enablesReturnKeyAutomatically={true}
						keyboardAppearance='default'
						returnKeyType='search'
						underlineColorAndroid='transparent'
						numberOfLines={1}
						onFocus={this.showCancel}
						onSubmitEditing={this.props.onSubmitSearch}
						/>
				</View>
				{this.renderCancel()}
			</View>
		)
	}
}