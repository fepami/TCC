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
import ViewPager from 'react-native-viewpager';
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

const PAGES = [
	require('../resources/image/tutorial1.png'),
	require('../resources/image/tutorial2.png'),
	require('../resources/image/tutorial3.png'),
	require('../resources/image/tutorial4.png'),
	require('../resources/image/tutorial5.png')
]
const dataSource = new ViewPager.DataSource({
	pageHasChanged: (p1, p2) => p1 !== p2,
});

export default class TutorialScene extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showButton: this.props.showButton,
			dataSource: dataSource.cloneWithPages(PAGES),
			height: Dimensions.get('window').height - 30 - HEADER_HEIGHT - (this.props.showButton ? 70 : TABBAR_HEIGHT),
			width: Dimensions.get('window').width
		};
		this.renderButton = this.renderButton.bind(this);
		this.renderHeader = this.renderHeader.bind(this);
		this.renderPage = this.renderPage.bind(this);
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

 	renderHeader() {
 		if (this.state.showButton) {
 			const noBack = {
				icon: '',
				onPress: this.doNothing.bind(this)
			};
 			return (
 				<Header
					navigator={this.props.navigator}
					title='Tutorial' 
					leftItem={noBack} />
 			)
 		} else {
 			return (
 				<Header
					navigator={this.props.navigator}
					title='Tutorial' />
 			)
 		}
 	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: 'black' }} onLayout={this._onLayoutDidChange}>
				{this.renderHeader()}
				<ViewPager
					style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
					dataSource={this.state.dataSource}
					renderPage={this.renderPage}
					isLoop={false}
					autoPlay={false}/>
				{this.renderButton()}
			</View>
		);
	}

	renderPage(data, pageID){
		return(
			<Image
				style={{width: this.state.width, height: this.state.height, resizeMode: 'contain'}}
				source={data}/>
		)
	}

	onPress() {
		this.props.navigator.resetTo({component: NavigationManager});
	}

	doNothing() {}
}

const styles = StyleSheet.create({
	box: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
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