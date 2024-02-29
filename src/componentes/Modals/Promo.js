import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Input } from "native-base";
import store from '../../redux/store'
import {server} from '../Api'
export default class Promo extends Component{
    constructor(){
        super()
        this.state={
            razon:'',
            item:''
        }
    }
    
    setRazon(text, num){
        this.setState({razon:text, item:num})
    }
    
    cancelar(){
        fetch(`${server}/reserva`,{
            method:'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body:JSON.stringify({
              razonCancel: this.state.razon,
              _id: this.props.reserva
            })
          })
          .then(response=>{
            this.setRazon('',0)
            this.props.cancelar()
          })
          .catch(error=>{
            alert(error)
          })
    }
    render(){
        return(
        <Modal
          visible={this.props.visible}
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
                height:Dimensions.get('window').height / 3.5,
                width:Dimensions.get('window').width - 40
              }}
            >
                <View style={estilo.titulo}>
                    <Icon
                        name='cut'
                        style={{color:'white'}}
                    />
                    <Text style={estilo.text}>
                    Promo
                    </Text>
                </View>
                <View style={{justifyContent:'flex-start'}}>
                    <View style={estilo.razon}>
                        <Input placeholder='Ingrese el codigo de promocion'></Input>
                    </View>
                </View>
                <View style={estilo.botones}>
                    <Button 
                        onPress={()=>{
                            this.props.promo(false)
                        }}
                        rounded
                        info
                        style={estilo.boton_1}>
                            <Text style={{color:'white', textAlign:'center'}}>Cancelar</Text>
                    </Button>
                    <Button 
                        onPress={()=>{
                            this.cancelar()
                        }}
                        rounded
                        danger
                        style={estilo.boton_2} 
                    >
                            <Text style={{color:'white', textAlign:'center',marginLeft:10}}>Enviar</Text>
                    </Button>
                </View>
            </View>
          </View>
        </Modal>
        )
    }
}
const estilo = StyleSheet.create({
  
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
        flexDirection:'row'
    },
    razon:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'red',
        borderRadius:15,
        width:Dimensions.get('window').width*0.7,
        height:Dimensions.get('window').height*0.05
    },
    boton_1:{
        marginTop:1,
        height:30,
        width:Dimensions.get('window').width*0.3,
        backgroundColor:'#676767'
    },
    boton_2:{
        marginTop:1,
        height:30,
        width:Dimensions.get('window').width*0.3
    },
    text_env:{

    },
    botones:{
        flexDirection:'row', 
        justifyContent:'space-around', 
        width:Dimensions.get('window').width*0.7
    },
    icono:{
        color:'black',
        fontSize:30
    },
    icon:{
        color:'green',
        fontSize:30
    }
})