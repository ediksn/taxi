import React, { Component} from 'react'
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight } from 'react-native'
import {  Icon,  Button, Text, Card, } from "native-base";
import store from '../../redux/store'
import {server} from '../Api/index'
import {WebView} from 'react-native-webview'
export default class Pagar extends Component{
    
    constructor(){
        super()
        this.state={
            visible:false,
            status: ''
        }
    }

    registrarPago(){
        if(this.props.conexion==='conectado'){
            if(this.props.tipo==='Saldo'){
                fetch(`${server}/cliente/${store.getState().id_user.toString()}`,{
                method:'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+store.getState().token.toString()
                }
                })
                .then(res=>{
                let data = JSON.parse(res._bodyInit)
                    if(JSON.parse(data.saldo)<JSON.parse(this.props.costo)){
                        this.props.addPay('insuficent')
                        this.props.mostrarModal()
                    }
                    else{
                        this.props.cambiarEstado('esperar')
                        this.props.mostrarModal('buscar')
                        this.props.crearViaje()
                    }
                })
                .catch(error=>{
                    alert(error)
                })
            }else{
                this.props.cambiarEstado('esperar')
                this.props.crearViaje()
                this.props.mostrarModal('buscar')
            }
        }
    }

    render(){
        return(
            <View style={style.view}>
                <View>
                <Modal 
                    visible={this.state.visible}
                    onRequestClose={()=>this.setState({visible:false})}>
                        <Button style={{width:ancho*0.17, justifyContent:'center'}} onPress={()=>{
                            this.setState({visible:false})
                        }}>
                            <Icon
                                name='arrow-back'
                                style={{color:'white', fontSize:20}}
                            />
                        </Button>
                        <WebView
                            onNavigationStateChange={data=>this.handleResponse(data)}    
                            source={{uri: `${server}/trans/paypal`,
                                method: 'POST',
                                body:'costo='+this.props.costo.toString()+'&cliente='+store.getState().id_user.toString()
                            }}>
                        </WebView>
                    </Modal>
                </View>
                <Card style={style.fondo}>
                    <View style={style.titulo}>
                        <Text style={style.text}>
                            Inicia tu viaje
                        </Text>
                    </View> 
                    <View style={style.adres}>
                        <Text style={style.text_pay}>
                        Monto estimado a cancelar {this.props.costo.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}$
                        </Text>
                    </View>
                    <TouchableHighlight underlayColor={'transparent'} onPress={()=>this.registrarPago()}>
                        <View style={{alignSelf:'center', justifyContent:'center'}}>
                            <Button
                                onPress={()=>this.registrarPago()} 
                                rounded
                                style={{backgroundColor:'black',justifyContent:'center' ,width:ancho*.9}}>
                                    <Text style={{color:'white', textAlign:'center'}}>Buscar Choferes</Text>
                            </Button>
                        </View>
                    </TouchableHighlight>
                </Card>
            </View>
        )
    }
}

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const style = StyleSheet.create({
    precio: {
        fontWeight: 'normal',
        color: '#E84546'
    },
    texto:{
        color: '#818181',
        fontSize: 12,
        fontWeight: 'normal'
    },
    costo: {
        color: '#818181',
        fontWeight: 'bold',
        textAlign: 'right'
    },
    adres:{
        alignItems:'center', 
        justifyContent:'center', 
        bottom:5,
        height: alto*0.1 
    },
    text_pay:{
        color:'black'
    },
    view:{
        margin: 0
    },
    text: {
        color:'white'
    },
    titulo:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        backgroundColor: '#E84546',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        
    },
    fondo:{
        marginBottom: -1,
        margin:0,
        marginHorizontal: 0,
        backgroundColor:'#FFFFFF',
        height: 170,
        width:ancho + 1
    },
    content:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        height:50,
        paddingHorizontal: 20,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 25,
        backgroundColor: '#D6D6D6'
    }
})