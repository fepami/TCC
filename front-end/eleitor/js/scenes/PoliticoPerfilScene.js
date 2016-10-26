import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	Platform
} from 'react-native';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from '../components/TouchableElement';
import Header from '../components/Header';
import ApprovalBar from '../components/ApprovalBar';

export default class PoliticoPerfilScene extends Component {
	constructor(props){
		super(props);
		this.state = {
			star_icon: 'ios-star-outline',
			like_icon: 'ios-thumbs-up',
			dislike_icon: 'ios-thumbs-down'
		}
		this.onStarActionSelected = this.onStarActionSelected.bind(this);
		this.onLikeActionSelected = this.onLikeActionSelected.bind(this);
		this.onDislikeActionSelected = this.onDislikeActionSelected.bind(this);
	}

	onStarActionSelected(){
		if(this.state.star_icon === 'ios-star-outline'){
			this.setState({star_icon: 'ios-star'});	
		} else {
			this.setState({star_icon: 'ios-star-outline'});
		}
	}

	onLikeActionSelected(){
		if(this.state.like_icon === 'ios-thumbs-up-outline'){
			this.setState({like_icon: 'ios-thumbs-up'});	
		} else {
			this.setState({like_icon: 'ios-thumbs-up-outline'});
			this.setState({dislike_icon: 'ios-thumbs-down'});
		}
	}

	onDislikeActionSelected(){
		if(this.state.dislike_icon === 'ios-thumbs-down-outline'){
			this.setState({dislike_icon: 'ios-thumbs-down'});	
		} else {
			this.setState({dislike_icon: 'ios-thumbs-down-outline'});
			this.setState({like_icon: 'ios-thumbs-up'});	
		}
	}

	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.arrow_icon}/>
		})
	}

	render(){
		const actions = [{
			title: 'Seguir',
			iconName: this.state.star_icon,
			show: 'always',
			onActionSelected: this.onStarActionSelected
		}];

		let like_bgcolor = (this.state.like_icon === 'ios-thumbs-up-outline') ? 'limegreen' : 'white';
		let like_icon_color = (this.state.like_icon === 'ios-thumbs-up-outline') ? 'white' : 'limegreen';
		let dislike_bgcolor = (this.state.dislike_icon === 'ios-thumbs-down-outline') ? 'red' : 'white';
		let dislike_icon_color = (this.state.dislike_icon === 'ios-thumbs-down-outline') ? 'white' : 'red';

		const approval_width = Dimensions.get('window').width - 30;
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title={this.props.nome} 
					actions={actions}/>
				<View style={styles.view}>
					<View style={{alignItems: 'center'}}>
						<View style={{width: 120}}>
							<Image
								style={styles.rounded_image}
								source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}} />
							<View style={styles.line}>
								<Text style={{color: 'white'}}>{this.props.vote}</Text>
							</View>
						</View>
					</View>
					<ApprovalBar viewSize={approval_width} approvalPercentage={this.props.approval} />
					<Text>{this.props.nome}, {this.props.idade}</Text>
					<Text>{this.props.cargo}</Text>
					<Text>{this.props.vigencia}</Text>
					<Text style={{paddingBottom: 15}}>{this.props.partido}</Text>
					<TouchableElement onPress={this.onPressHistorico}>
						<View style={styles.cell_top}>
							<Text style={styles.cell_text}>Histórico de Propostas</Text>
							{this.renderIcon()}
						</View>
					</TouchableElement>
					<TouchableElement onPress={this.onPressCarreira}>
						<View style={styles.cell_bottom}>
							<Text style={styles.cell_text}>Carreira Política</Text>
							{this.renderIcon()}
						</View>
					</TouchableElement>
					<View style={styles.box}>
						<TouchableElement onPress={this.onLikeActionSelected} style={[styles.like, {backgroundColor: like_bgcolor}]}>
							<Icon name='md-thumbs-up' color={like_icon_color} size={30}/>
						</TouchableElement>
						<TouchableElement onPress={this.onDislikeActionSelected} style={[styles.dislike, {backgroundColor: dislike_bgcolor}]}>
							<Icon name='md-thumbs-down' color={dislike_icon_color} size={30}/>
						</TouchableElement>
					</View>
				</View>
			</View>
		)
	}

	onPressHistorico(data){
		// console.log(data);
		// this.props.navigator.push({component: PoliticoPerfilScene, passProps: {nome: data.nome}});
	}

	onPressCarreira(data){
		// console.log(data);
		// this.props.navigator.push({component: PoliticoPerfilScene, passProps: {nome: data.nome}});
	}
}

const styles = StyleSheet.create({
	view: {
		padding: 15,
		flexDirection: 'column',
		flex: 1
	},
	rounded_image: {
		width: 100, 
		height: 100, 
		borderRadius: 50,
		alignSelf: 'center',
		borderColor: 'red', // trocar para preto
		borderWidth: 1
	},
	line: {
		position: 'absolute',
		bottom: 0,
		width: 120,
		height: 30,
		borderTopColor: 'red', // trocar para preto
		borderTopWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent'
	},
	cell_top: {
		paddingVertical: 15,
		flexDirection: 'row', 
		borderTopColor: 'rgba(0,0,0,.87)',
		borderTopWidth: 1,
		borderBottomColor: 'rgba(0,0,0,.87)',
		borderBottomWidth: 1
	},
	cell_bottom: {
		paddingVertical: 15,
		flexDirection: 'row', 
		borderBottomColor: 'rgba(0,0,0,.87)',
		borderBottomWidth: 1
	},
	cell_text: {
		flex: 1, 
		alignSelf: 'center'
	},
	arrow_icon: {
		alignSelf: 'center'
	},
	box: {
		height: 100,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	like: {
		width: 100,
		height: 40,
		margin: 15,
		borderColor: 'limegreen',
		borderWidth: 1,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	},
	dislike: {
		width: 100,
		height: 40,
		margin: 15,
		borderColor: 'red',
		borderWidth: 1,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	}
})