import React, {Component} from 'react';
import {
	View,
	Text
} from 'react-native';
import Header from '../components/Header';

export default class PoliticoPerfilScene extends Component {
	constructor(props){
		super(props);
		this.state = {
			icon: 'ios-star-outline'
		}
		this.onActionSelected = this.onActionSelected.bind(this);
	}
	onActionSelected(){
		if(this.state.icon === 'ios-star-outline'){
			this.setState({icon: 'ios-star'});	
		} else {
			this.setState({icon: 'ios-star-outline'});
		}
	}
	render(){
		const actions = [{
			title: 'Seguir',
			iconName: this.state.icon,
			show: 'always',
			onActionSelected: this.onActionSelected
		}];
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title={this.props.nome} 
					actions={actions}/>
				<Text>PERFIL DO POLITICO</Text>
			</View>
		)
	}
}