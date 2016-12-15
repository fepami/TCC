import React, {Component} from 'react';
import {
	AsyncStorage,
	BackAndroid,
	Navigator,
	Platform
} from 'react-native';
import NavigationManager from './navigation/NavigationManager';
import LoginScene from './scenes/LoginScene';

class DefaultNavigator extends Component {
	componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        const {navigator} = this.refs;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true;
        }
        return false;
    }

	render(){
		return(
			<Navigator
				ref='navigator'
				style={{flex: 1, backgroundColor: '#2B2B2B'}}
				//mudar de NavigationManager para login
				initialRoute={{component: this.props.initialRoute}}
				// initialRoute={{component: NavigationManager}}
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
		)
	}
	renderScene(route, navigator) {
		return <route.component {...route.passProps} navigator={navigator} />
	}
}

export default DefaultNavigator;