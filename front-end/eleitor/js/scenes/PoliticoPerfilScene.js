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
			starIcon: 'ios-star-outline',
			likeIcon: 'ios-thumbs-up',
			dislikeIcon: 'ios-thumbs-down'
		}
		this.onStarActionSelected = this.onStarActionSelected.bind(this);
		this.onLikeActionSelected = this.onLikeActionSelected.bind(this);
		this.onDislikeActionSelected = this.onDislikeActionSelected.bind(this);
	}

	onStarActionSelected(){
		if(this.state.starIcon === 'ios-star-outline'){
			this.setState({starIcon: 'ios-star'});	
		} else {
			this.setState({starIcon: 'ios-star-outline'});
		}
	}

	onLikeActionSelected(){
		if(this.state.likeIcon === 'ios-thumbs-up-outline'){
			this.setState({likeIcon: 'ios-thumbs-up'});	
		} else {
			this.setState({likeIcon: 'ios-thumbs-up-outline'});
			this.setState({dislikeIcon: 'ios-thumbs-down'});
		}
	}

	onDislikeActionSelected(){
		if(this.state.dislikeIcon === 'ios-thumbs-down-outline'){
			this.setState({dislikeIcon: 'ios-thumbs-down'});	
		} else {
			this.setState({dislikeIcon: 'ios-thumbs-down-outline'});
			this.setState({likeIcon: 'ios-thumbs-up'});	
		}
	}

	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.arrowIcon}/>
		})
	}

	render(){
		const actions = [{
			title: 'Seguir',
			iconName: this.state.starIcon,
			show: 'always',
			onActionSelected: this.onStarActionSelected
		}];

		let like_bgcolor = (this.state.likeIcon === 'ios-thumbs-up-outline') ? 'limegreen' : 'white';
		let likeIcon_color = (this.state.likeIcon === 'ios-thumbs-up-outline') ? 'white' : 'limegreen';
		let dislike_bgcolor = (this.state.dislikeIcon === 'ios-thumbs-down-outline') ? 'red' : 'white';
		let dislikeIcon_color = (this.state.dislikeIcon === 'ios-thumbs-down-outline') ? 'white' : 'red';

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
								style={styles.roundedImage}
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
						<View style={styles.cellTop}>
							<Text style={styles.cellText}>Histórico de Propostas</Text>
							{this.renderIcon()}
						</View>
					</TouchableElement>
					<TouchableElement onPress={this.onPressCarreira}>
						<View style={styles.cellBottom}>
							<Text style={styles.cellText}>Carreira Política</Text>
							{this.renderIcon()}
						</View>
					</TouchableElement>
					<View style={styles.box}>
						<TouchableElement onPress={this.onLikeActionSelected} style={[styles.like, {backgroundColor: like_bgcolor}]}>
							<Icon name='md-thumbs-up' color={likeIcon_color} size={30}/>
						</TouchableElement>
						<TouchableElement onPress={this.onDislikeActionSelected} style={[styles.dislike, {backgroundColor: dislike_bgcolor}]}>
							<Icon name='md-thumbs-down' color={dislikeIcon_color} size={30}/>
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
	roundedImage: {
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
	cellTop: {
		paddingVertical: 15,
		flexDirection: 'row', 
		borderTopColor: 'rgba(0,0,0,.87)',
		borderTopWidth: 1,
		borderBottomColor: 'rgba(0,0,0,.87)',
		borderBottomWidth: 1
	},
	cellBottom: {
		paddingVertical: 15,
		flexDirection: 'row', 
		borderBottomColor: 'rgba(0,0,0,.87)',
		borderBottomWidth: 1
	},
	cellText: {
		flex: 1, 
		alignSelf: 'center'
	},
	arrowIcon: {
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