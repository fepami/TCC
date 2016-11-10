import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TabBarIOS,
	Navigator,
	Platform
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
		return <route.component {...route.passProps} navigator={navigator} />
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
			<TabBarIOS tintColor='green' translucent={false}>
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
									renderScene={this.renderScene}
									configureScene={route => {
										if(Platform.OS === 'android'){
											return Navigator.SceneConfigs.FloatFromBottomAndroid;
										}
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
		// return(
		// 	<TabBarIOS tintColor='green' translucent={false}>
		// 		<Icon.TabBarItem
		// 			title='Home'
		// 			selected={this.props.tab === 'home'}
		// 			onPress={this.onTabSelect.bind(this, 'home')}
		// 			iconName='ios-home-outline'
		// 			selectedIconName='ios-home'>
		// 			<View style={styles.container}>
		// 				<HomeScene navigator={this.props.navigator}/>
		// 			</View>
		// 		</Icon.TabBarItem>
		// 		<Icon.TabBarItem
		// 			title='Políticos'
		// 			selected={this.props.tab === 'politicos'}
		// 			onPress={this.onTabSelect.bind(this, 'politicos')}
		// 			iconName='ios-contacts-outline'
		// 			selectedIconName='ios-contacts'>
		// 			<View style={styles.container}>
		// 				<ListaPoliticosScene navigator={this.props.navigator}/>
		// 			</View>
		// 		</Icon.TabBarItem>
		// 		<Icon.TabBarItem
		// 			title='Propostas'
		// 			selected={this.props.tab === 'propostas'}
		// 			onPress={this.onTabSelect.bind(this, 'propostas')}
		// 			iconName='ios-bookmarks-outline'
		// 			selectedIconName='ios-bookmarks'>
		// 			<View style={styles.container}>
		// 				<ListaPropostasScene navigator={this.props.navigator}/>
		// 			</View>
		// 		</Icon.TabBarItem>
		// 		<Icon.TabBarItem
		// 			title='Seguindo'
		// 			selected={this.props.tab === 'seguindo'}
		// 			onPress={this.onTabSelect.bind(this, 'seguindo')}
		// 			iconName='ios-star-outline'
		// 			selectedIconName='ios-star'>
		// 			<View style={styles.container}>
		// 				<SeguindoScene navigator={this.props.navigator}/>
		// 			</View>
		// 		</Icon.TabBarItem>
		// 		<Icon.TabBarItem
		// 			title='Perfil'
		// 			selected={this.props.tab === 'perfil'}
		// 			onPress={this.onTabSelect.bind(this, 'perfil')}
		// 			iconName='ios-person-outline'
		// 			selectedIconName='ios-person'>
		// 			<View style={styles.container}>
		// 				<UsuarioPerfilScene navigator={this.props.navigator}/>
		// 			</View>
		// 		</Icon.TabBarItem>
		// 	</TabBarIOS>
		// )
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