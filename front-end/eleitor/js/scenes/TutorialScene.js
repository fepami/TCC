import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	Platform,
	StatusBar
} from 'react-native';
import Carousel from 'react-native-looped-carousel';
import Header from '../components/Header';
import TouchableElement from '../components/TouchableElement';
import NavigationManager from '../navigation/NavigationManager';

const ANDROID_STATUS_BAR_HEIGHT = Platform.Version >= 19 ? StatusBar.currentHeight : 0;
const ANDROID_HEADER_HEIGHT = 56 + ANDROID_STATUS_BAR_HEIGHT;
const IOS_HEADER_HEIGHT = 64;
const HEADER_HEIGHT = Platform.select({
		ios: IOS_HEADER_HEIGHT,
		android: ANDROID_HEADER_HEIGHT -25
	})
const TABBAR_HEIGHT = Platform.select({
		ios: 49,
		android: 0
	})

export default class TutorialScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showButton: this.props.showButton
		};
		this.renderButton = this.renderButton.bind(this);
	}
 
 	renderButton() {
 		if (this.state.showButton) {
 			return (
 				<View style={styles.box}>
					<TouchableElement onPress={this.onPress.bind(this)} style={styles.button}>
						<Text style={{fontWeight: 'bold', color: 'white'}}>OK, entendi.</Text>
					</TouchableElement>
				</View>
 			)
 		}
 	}

	render() {
		const button_tabbar_height = this.props.showButton ? 70 : TABBAR_HEIGHT;
		const width = Dimensions.get('window').width;
		const height = Dimensions.get('window').height - HEADER_HEIGHT - button_tabbar_height;
		
		return (
			<View style={{ flex: 1, backgroundColor: 'black' }} onLayout={this._onLayoutDidChange}>
				<Header
					navigator={this.props.navigator}
					title='Tutorial' />
				<Carousel
					style={{width: width, height: height}}
					autoplay={false}
					pageInfo={false}
					pageStyle={{ backgroundColor: 'black' }}
					bullets={true}
					onAnimateNextPage={(p) => console.log(p)} >
					<Image
						style={{width: width, height: height -30, resizeMode: 'contain'}}
						source={require('../resources/image/tutorial1.png')}/>
					<Image
						style={{width: width, height: height -30, resizeMode: 'contain'}}
						source={require('../resources/image/tutorial2.png')}/>
					<Image
						style={{width: width, height: height -30, resizeMode: 'contain'}}
						source={require('../resources/image/tutorial3.png')}/>
					<Image
						style={{width: width, height: height -30, resizeMode: 'contain'}}
						source={require('../resources/image/tutorial4.png')}/>
					<Image
						style={{width: width, height: height -30, resizeMode: 'contain'}}
						source={require('../resources/image/tutorial5.png')}/>
				</Carousel>
				{this.renderButton()}
			</View>
		);
	}

	onPress() {
		this.props.navigator.replace({component: NavigationManager});
	}
}

const styles = StyleSheet.create({
	box: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		flex: 1,
		height: 40,
		marginTop: 10,
		marginBottom: 20,
		marginHorizontal: 15,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#33CCCC'
	}
});