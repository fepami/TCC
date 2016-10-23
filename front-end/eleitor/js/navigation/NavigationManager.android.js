import React, {Component} from 'react';
import {
	View,
	Text,
	DrawerLayoutAndroid,
	StatusBar,
	BackAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { switchTab } from '../redux/actions/navigation';
import MenuItem from './MenuItem';
import ListaPoliticosScene from '../scenes/ListaPoliticosScene';
import HomeScene from '../scenes/HomeScene';

class NavigationManager extends Component {
	constructor(props){
		super(props);
		this.state = {
			drawerOpened: false
		};
		this.openDrawer = this.openDrawer.bind(this);
	}

	componentDidMount(){
		BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
	}

	componentWillUnmount(){
		BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
	}

	handleBackButton(){
		if(this.state.drawerOpened){
			this.refs.drawer.closeDrawer();
			return true;
		}
		return false;
	}

	onTabSelect(tab){
		this.props.onTabSelect(tab);
		this.refs.drawer.closeDrawer();
	}

	getChildContext() {
		return {
			openDrawer: this.openDrawer,
		};
	}

	openDrawer() {
		this.refs.drawer.openDrawer();
	}

	renderNavigationView(){
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<MenuItem
					icon='home'
					title='Home'
					selected={this.props.tab === 'home'}
					onPress={this.onTabSelect.bind(this, 'home')} />
				<MenuItem
					icon='person'
					title='Políticos'
					selected={this.props.tab === 'politicos'}
					onPress={this.onTabSelect.bind(this, 'politicos')} />
			</View>
		)
	}

	renderContent(){
		switch(this.props.tab){
			case 'home':
				return <HomeScene navigator={this.props.navigator}/>
			case 'politicos':
				return <ListaPoliticosScene navigator={this.props.navigator}/>
			default: 
				return (
					<View style={{flex: 1, backgroundColor: 'white'}}>
						<Text>DEFAULT</Text>
					</View>
				)
		}
	}

	render(){
		return (
			<DrawerLayoutAndroid
				ref='drawer'
				drawerWidth={300}
				drawerPosition={DrawerLayoutAndroid.positions.Left}
				renderNavigationView={this.renderNavigationView.bind(this)}
				onDrawerClose={()=>this.setState({drawerOpened: false})}
				onDrawerOpen={()=>this.setState({drawerOpened: true})}>
				<View style={{flex: 1}}>
					{this.renderContent()}
				</View>
			</DrawerLayoutAndroid>
		)
	}
}

NavigationManager.childContextTypes = {
	openDrawer: React.PropTypes.func,
};

function mapStateToProps(store){
	return {
		tab: store.navigation.tab
	}
}

function mapDispatchToProps(dispatch){
	return {
		onTabSelect: tab => dispatch(switchTab(tab))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationManager)