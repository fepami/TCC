import React from 'react';
import { 
	View, 
	ActivityIndicator,
	Platform,
	StatusBar,
	StyleSheet
} from 'react-native';

export default (props) => (
    <View style={[styles.view, props.style]}>
        <ActivityIndicator size='large' animating={true} />
    </View>
)

const ANDROID_STATUS_BAR_HEIGHT = Platform.Version >= 19 ? StatusBar.currentHeight : 0;
const ANDROID_HEADER_HEIGHT = 56 + ANDROID_STATUS_BAR_HEIGHT;
const IOS_HEADER_HEIGHT = 64;
const HEADER_HEIGHT = Platform.select({
		ios: IOS_HEADER_HEIGHT,
		android: ANDROID_HEADER_HEIGHT -25
	})

const styles = StyleSheet.create({
	view: {
		flex: 1, 
		justifyContent: 'center', 
		alignItems: 'center', 
		backgroundColor: 'rgba(200,200,200,0.3)',
		position: 'absolute', 
		top: HEADER_HEIGHT, 
		right: 0, 
		left: 0, 
		bottom: 0
	}
})