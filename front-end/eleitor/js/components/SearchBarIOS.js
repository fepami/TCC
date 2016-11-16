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
			showCancel: false
		}
		this.showCancel = this.showCancel.bind(this);
		this.hideCancel = this.hideCancel.bind(this);
	}

	showCancel() {
		this.setState({showCancel: true});
	}

	hideCancel() {
		this.setState({showCancel: false});
		dismissKeyboard();
		this.refs['searchbar'].clear(0);
	}

	renderCancel() {
		if(this.state.showCancel === true) {
			return(
				<TouchableElement onPress={this.hideCancel} style={{height: 50, alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
					<Text style={{alignSelf: 'center'}}>Cancelar</Text>
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
					<Icon name='ios-search-outline' size={20} style={{alignSelf: 'center', marginLeft: 10, marginRight: 3}} color='#525252' />
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