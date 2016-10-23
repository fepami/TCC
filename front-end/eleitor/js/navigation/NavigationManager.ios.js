import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TabBarIOS
} from 'react-native';
import { switchTab } from '../redux/actions/navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ListaPoliticosScene from '../scenes/ListaPoliticosScene';
import HomeScene from '../scenes/HomeScene';

class NavigationManager extends Component{
	onTabSelect(tab){
		this.props.onTabSelect(tab);
	}
	render(){
		return(
			<TabBarIOS tintColor='green'>
				<Icon.TabBarItem
					title='home'
					selected={this.props.tab === 'home'}
					onPress={this.onTabSelect.bind(this, 'home')}
					iconName='ios-home-outline'
					selectedIconName='ios-home'>
					<View style={styles.container}>
						<HomeScene navigator={this.props.navigator}/>
					</View>
				</Icon.TabBarItem>
				<Icon.TabBarItem
					title='politicos'
					selected={this.props.tab === 'politicos'}
					onPress={this.onTabSelect.bind(this, 'politicos')}
					iconName='ios-person-outline'
					selectedIconName='ios-person'>
					<View style={styles.container}>
						<ListaPoliticosScene navigator={this.props.navigator}/>
					</View>
				</Icon.TabBarItem>
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