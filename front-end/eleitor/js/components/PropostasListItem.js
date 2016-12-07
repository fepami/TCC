import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from './TouchableElement';
import {Pie} from 'react-native-pathjs-charts';

export default class PropostasListItem extends Component {
	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.icon}/>
		})
	}

	renderRanking() {
		if (this.props.cellType === 'ranking') {
			return(
				<Text style={[styles.ranking, {width: (this.props.proposta.ranking < 100) ? 20 : 30}]}>{this.props.proposta.ranking}</Text>
			)
		} else {
			return null;
		}
	}

	render() {
		const like = this.props.proposta.approval ? this.props.proposta.approval * 100 : 1;
		const dislike = like === 100 ? 1 : 100 - like;
		const pieData = [{name: ' ', approval: like}, {name: '  ', approval: dislike}];
		const pieOptions = {
			center: [25,25],
			width: 50, 
			height: 50, 
			color: '#ff0000',
            R: 24,
            r: 5,
        	animate: {
                type: 'oneByOne',
                duration: 200,
                fillTransition: 3
            }
        };
		return(
			<TouchableElement onPress={this.props.onPress}>
				<View style={styles.cell}>
					{this.renderRanking()}
					<View style={{alignSelf: 'center'}}>
						<Pie
							data={pieData}
							options={pieOptions}
							pallete={[{r: 50, g: 205, b: 50}, {r: 255, g: 0, b: 0}]}
							accessorKey="approval" />
					</View>
					<View style={styles.info}>
						<Text style={styles.h1}>{this.props.proposta.nome}</Text>
						<Text>Categoria: {this.props.proposta.categoria}</Text>
						<Text>Proposta em: {this.props.proposta.data}</Text>
					</View>
					{this.renderIcon()}
				</View>
			</TouchableElement>
		)
	}
}

const styles = StyleSheet.create({
	cell: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		flexDirection: 'row'
	},
	h1: {
		fontWeight: 'bold'
	},
	roundedimage: {
		width: 50, 
		height: 50, 
		borderRadius: 25,
		borderColor: 'black',
		borderWidth: 1,
		alignSelf: 'center'
	},
	info: {
		flexDirection: 'column', 
		flex: 1, 
		paddingHorizontal: 15
	},
	icon: {
		alignSelf: 'center'
	},
	ranking: {
		color: 'black', 
		marginRight: 10, 
		alignSelf: 'center',
		textAlign: 'center'
	}
})