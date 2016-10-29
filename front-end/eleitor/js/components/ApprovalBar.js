import React, {Component} from 'react';
import {
	StyleSheet,
	View
} from 'react-native';

export default class ApprovalBar extends Component {
	render() {
		const container_size = this.props.viewSize - 2;
		const green_size = container_size * this.props.approvalPercentage / 100;
		const red_size = container_size - green_size;
		let green_style = styles.green;
		let red_style = styles.red;

		if (green_size == 0 || red_size == 0) {
			green_style = [styles.green, styles.allBorderRounded];
			red_style = [styles.red, styles.allBorderRounded];
		}
		return(
			<View style={styles.container}>
				<View style={[green_style, {width: green_size}]}></View>
				<View style={[red_style, {width: red_size}]}></View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginVertical: 15,
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 5,
		height: 15
	},
	green: {
		backgroundColor: 'limegreen',
		borderTopLeftRadius: 4,
		borderBottomLeftRadius: 4,
		height: 13
	},
	red: {
		backgroundColor: 'red',
		borderTopRightRadius: 4,
		borderBottomRightRadius: 4,
		height: 13,
	},
	allBorderRounded: {
		borderRadius: 4
	}
})