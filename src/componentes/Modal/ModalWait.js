import React, {Component} from 'react'
import Modal from 'react-native-modalbox'
import { StatusBar, Platform  ,StyleSheet, AsyncStorage,Dimensions, TouchableHighlight, PermissionsAndroid} from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, View, Input, Item, Header, InputGroup } from "native-base";

export default class ModalW extends Component{
    render(){
        return(
            <Modal>
            <View style={style.container}>
                <Text>Esperando</Text>
            </View>
            </Modal>
        )
    }
}

const style = StyleSheet.create({
    container:{
        position:'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height*0.4
    }
})