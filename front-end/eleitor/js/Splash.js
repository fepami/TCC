import React, {Component} from 'react';
import {
	AsyncStorage,
	Navigator,
	Platform
} from 'react-native';
import NavigationManager from './navigation/NavigationManager';
import LoginScene from './scenes/LoginScene';
import LoadingOverlay from './components/LoadingOverlay';
import DefaultNavigator from './DefaultNavigator';
import ApiCall from './api/ApiCall';
import {setToken} from './redux/actions/token';
import {connect} from 'react-redux';
import FBSDK from 'react-native-fbsdk';
const {
  LoginManager,
} = FBSDK;

class Splash extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		AsyncStorage.getItem('token', (error, token) => {
			token ? ApiCall('test_token', {token}, (jsonResponse) => {
				this.setState({token});
				this.props.setToken(token);
			}, (failedRequest) => {
				this.setState({error: true});
				LoginManager.logOut();
				// status 418 = token expirado
				// status 419 = token prestes a expirar, melhor relogar
				// status 500 = erro
			}) : this.setState({error: true});
		});
	}

	render(){
		if (this.state.error) {
			return (<DefaultNavigator initialRoute={LoginScene} />);
		}
		return this.state.token ? <DefaultNavigator initialRoute={NavigationManager}/> : <LoadingOverlay style={{top: 0}}/>;
	}
}

function mapStateToProps(store) {
	return {
		token: store.token.token
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setToken: token => dispatch(setToken(token))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);