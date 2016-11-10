import React, {Component} from 'react';
import {
  Platform, 
  Picker,
  Text,
  View,
  Modal,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from './TouchableElement';

class CustomPicker extends Component {
  constructor(props){
    super(props);
    this.state = {
      showModalView: false,
      selectedValue: ''
    }
  }

  showModalView(value){
    this.setState({showModalView: value});
  }

  onValueChange(...args){
    this.showModalView(false);
    this.props.onValueChange(...args);
  }

  render() {
    let text, selected;
    if(this.props.selectedValue) {
      selected = true;
      let filtered = this.props.children.filter(child => child.props.value === this.props.selectedValue);
      if(filtered.length === 0) {
        filtered = this.props.children.filter(child => child.props.value === undefined);
      }
      text = filtered[0] && filtered[0].props.label;  
    } else {
      selected = false;
      text = this.props.children[0].props.label;
    }
    
    const deviceHeight = Platform.select({
      ios: 28,
      android: 35
    })
    return (
      <View style={{flex: 1}}>
        <TouchableElement onPress={this.showModalView.bind(this, true)} style={this.props.style}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', height: deviceHeight, alignItems: 'center', paddingLeft: 10}}>
            <Text style={{fontSize: 16, color: selected ? this.props.color: 'rgba(0,0,0,.2)'}}>{text}</Text>
            <Icon name='ios-arrow-dropdown' size={16} color={this.props.color} style={{marginHorizontal: 10}}/>
          </View>
        </TouchableElement>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.showModalView}
          onRequestClose={this.showModalView.bind(this, false)}>
          <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)'}} >
            <TouchableOpacity onPress={this.showModalView.bind(this, false)} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}><View/></TouchableOpacity>
            <View style={{backgroundColor: 'white', margin: 16, borderRadius: 8}}>
              <Picker {...this.props} onValueChange={this.onValueChange.bind(this)} style={{}} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default Platform.OS === 'android'? Picker : CustomPicker;