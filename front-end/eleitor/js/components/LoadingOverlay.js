import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default (props) => (
    <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}, props.style]}>
        <ActivityIndicator size='large' animating={true} />
    </View>
)