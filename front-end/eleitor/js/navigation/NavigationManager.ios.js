import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TabBarIOS,
	Navigator
} from 'react-native';
import { switchTab } from '../redux/actions/navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import HomeScene from '../scenes/HomeScene';
import ListaPoliticosScene from '../scenes/ListaPoliticosScene';
import ListaPropostasScene from '../scenes/ListaPropostasScene';
import SeguindoScene from '../scenes/SeguindoScene';
import UsuarioPerfilScene from '../scenes/UsuarioPerfilScene';

class NavigationManager extends Component{
	onTabSelect(tab){
		this.props.onTabSelect(tab);
	}
	renderScene(route, navigator) {
		navigator.refresh && navigator.getCurrentRoutes().length === 1 && navigator.refresh();
		return <route.component {...route.passProps} navigator={navigator} rootNavigator={this.props.navigator} />
	}
	render(){
		const tabs = [
			{tab: 'home', title: 'Home', icon: 'home', component: HomeScene}, 
			{tab: 'politicos', title: 'Políticos', icon: 'account-balance', component: ListaPoliticosScene}, 
			{tab: 'propostas', title: 'Propostas', icon: 'assignment', component: ListaPropostasScene}, 
			{tab: 'seguindo', title: 'Seguindo', icon: 'star', component: SeguindoScene}, 
			{tab: 'perfil', title: 'Perfil', icon: 'person', component: UsuarioPerfilScene}
		];
		return(
			<TabBarIOS unselectedTintColor='white' tintColor='#33CCCC' translucent={false} barTintColor='#2B2B2B'>
				{tabs.map(tab => {
					return (
						<Icon.TabBarItem
							key={tab.tab}
							title={tab.title}
							selected={this.props.tab === tab.tab}
							onPress={this.onTabSelect.bind(this, tab.tab)}
							iconName={tab.icon}
							selectedIconName={tab.icon}>
							<View style={styles.container} >
								<Navigator
									ref='navigator'
									style={{flex: 1}}
									initialRoute={{component: tab.component}}
									renderScene={this.renderScene.bind(this)}
									configureScene={route => {
										if(route.modal){
											return Navigator.SceneConfigs.FloatFromBottom;
										} else {
											return Navigator.SceneConfigs.FloatFromRight;
										}
									}}
								/>
							</View>
						</Icon.TabBarItem>
					)
				})}
			</TabBarIOS>
		)
	}
}

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

export default connect(mapStateToProps, mapDispatchToProps)(NavigationManager);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: 49
	}
})