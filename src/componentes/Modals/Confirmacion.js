import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from "native-base";
import store from '../../redux/store'
import {server} from '../Api'
export default class Confirmada extends Component{ 
    cancelar(){
        fetch(`${server}/reserva`,{
            method:'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body:JSON.stringify({
              estatus: 'Abortada',
              _id: this.props.reserva
            })
          })
          .then(response=>{
            this.props.cancelar()
          })
          .catch(error=>{
            alert(error)
          })
    }
    render(){
        return(
        <Modal
          visible={this.props.confirmar}
          transparent={true}
        >
          <View style={{
            flex:1,
            flexDirection:'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'#000000c2'}}>
            <View 
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor:'#fff',
                paddingBottom: 20,
                borderRadius: 25,
                height:Dimensions.get('window').height / 2.5,
                width:Dimensions.get('window').width - 40
              }}
            >
                <View style={style.titulo}>
                    <Icon
                        name='time'
                    />
                    <Text style={style.text}>
                    Reserva
                    </Text>
                </View>
                <View>
                    <Text state={{textAlign:'center'}}>Su solicitud ha sido confirmada</Text>
                </View>
                <View >
                    <Button 
                        onPress={()=>{
                        }}
                        rounded
                        style={{backgroundColor:'#676767',justifyContent:'center'}}>
                            <Text style={{color:'white', textAlign:'center'}}>OK</Text>
                    </Button>
                </View>
            </View>
          </View>
        </Modal>
        )
    }
}
const style = StyleSheet.create({
  
    text: {
        color:'white'
    },
    titulo:{
        width:Dimensions.get('window').width - 40,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#E84546',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    }
})