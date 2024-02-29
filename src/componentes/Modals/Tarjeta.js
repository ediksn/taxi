import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet, AsyncStorage, Image, TouchableHighlight} from "react-native";
import { Icon, Button,Text, CheckBox} from "native-base";
import store from '../../redux/store'
import {createId,createToken,setLocation} from '../../redux/actions'
import {server} from '../Api'
import NavigationService from '../../../NavigationService/NavigationService'
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import styles from 'react-native-phone-input/lib/styles';
import Mensaje from './Mensajes';
import Cargando from './Cargando'
export default class Tarjeta extends Component{
    constructor(){
        super()
        this.state={
            card:'',
            check:false,
            numero:'',
            expiracion:'',
            cvc:'',
            valido:false,
            cargando:false,
            visible:false,
            mensaje:''
        }
        this.setmensaje=this.setmensaje.bind(this)
    }
    
    setmensaje(data){
        this.setState({
            visible:data
        })
    }

    botones(){
        return(
            <View style={{flexDirection:'row', width:ancho*0.7,marginBottom:alto*0.01, justifyContent:'space-between'}}>
                <Button 
                    onPress={()=>{
                        this.props.cerrarTarjeta(false)
                        if(this.props.setSelet) this.props.setSelet('')
                        if(this.props.setmensaje) this.props.setmensaje(true)
                    }}
                    rounded
                    dark>
                        <Text style={{color:'white', textAlign:'center'}}>Cancelar</Text>
                </Button>
                <Button
                    onPress={()=>{
                        if(this.state.valido){
                            this.saveTarjeta()
                        }
                    }}
                    rounded
                    danger>
                        <Text style={{color:'white', textAlign:'center'}}>Aceptar</Text>
                </Button>
            </View>
        )
    }

    saveTarjeta(){
        this.setState({cargando:true})
        fetch(`${server}/cliente`,{
            method:'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body:JSON.stringify({
                tarjeta:{
                    numero:this.state.numero,
                    expiracion:'20'+this.state.expiracion.substring(3)+this.state.expiracion.substring(0,2),
                    cvc:this.state.cvc,
                    tipo:this.state.card,
                    default:true
                },
                guardar:this.state.check
            })
        })
        .then(response=>{
            let data = JSON.parse(response._bodyInit)
            if(data.error){
                this.setState({
                    cargando:false,
                    mensaje:data.error,
                    visible:true    
                })
            }else{
                this.setState({
                    cargando:false,
                    mensaje:this.state.check?'Tarjeta guardada exitosamente':'Lo cargos de viajes se efectuaran a esta tarjeta',
                    visible:true
                })
                if(this.props.saldo){
                    this.props.cerrarTarjeta(false, true)
                    fetch(`${server}/trans/recarga/tarjeta`,{
                        method:'POST',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type':'application/json',
                          'Authorization': 'Bearer '+store.getState().token.toString()
                        },
                        body:JSON.stringify({
                            total:this.props.saldo
                        })
                    })
                    .then(res=>{
                        let data = JSON.parse(res._bodyInit)
                        setTimeout(()=>this.props.setmensaje(true,
                            mensaje=data.status==='denied'||data.message?'La transaccion ha sido rechazada, intentelo nuevamente':
                            'Gracias por usar nuestra billetera, su saldo ha sido abonado ' ),3000)
                    })
                    .catch(error=>alert(error))
                }
                if(!this.props.saldo) setTimeout(()=>this.props.cerrarTarjeta(false),2000)
            }
        })
        .catch(error=>{
            this.setState({cargando:false},alert(error))
        })
    }

    render(){
        return(
        <Modal
          visible={this.props.visible}
          transparent={true}
        >
            <Mensaje visible={this.state.visible} mensaje={this.state.mensaje} setmensaje={this.setmensaje}/>
            <Cargando visible={this.state.cargando}/>
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
                    borderRadius: 25,
                    height:'auto',
                    width:Dimensions.get('window').width - 40
                }}
                >
                    <View style={estilo.titulo}>
                        <Icon
                            name='card'
                            style={{color:'white'}}
                        />
                        <Text style={[estilo.text,{marginLeft:5}]}>
                        Tarjeta
                        </Text>
                    </View>
                    <View style={{justifyContent:'flex-start'}}>
                        <View style={estilo.razon}>
                            <CreditCardInput
                                ref={ref=>this.creditCard=ref}
                                onChange={form=>this.setState({
                                    numero:form.values.number,
                                    cvc:form.values.cvc,
                                    expiracion:form.values.expiry,
                                    card:form.values.type,
                                    valido:form.valid
                                })}
                                allowScroll={true}
                                labels={{
                                    number:"Número de Tarjeta",
                                    expiry:"Venc",
                                    cvc:"CVC/CCV",
                                    type:"Tipo de tarjeta"
                                }}
                            />
                        </View>
                        <View style={estilo.check}>
                            <Text style={{textAlign:'center', fontWeight:'bold', color:'red'}}>Guardar esta tarjeta</Text>
                            <CheckBox
                                color='green'
                                checked={this.state.check}
                                onPress={()=>this.setState({check:!this.state.check})}
                            />
                        </View>
                        <View style={[estilo.item,{justifyContent:'flex-end', marginBottom:5}]}>
                            <Text>** Tarjetas aceptadas</Text>
                            <Image
                                source={require('../../assets/images/visa.png')}
                                resizeMode='contain'
                                style={{height:20, width:45}}
                            />
                            <Image
                                source={require('../../assets/images/mastercard.jpeg')}
                                resizeMode='contain'
                                style={{height:20, width:45}}
                            />
                            <Image
                                source={require('../../assets/images/american_express.png')}
                                resizeMode='contain'
                                style={{height:20, width:40}}
                            />
                        </View>
                        {!this.state.valido&&
                            <Text style={{color:'red',fontStyle:'italic',marginLeft:30}}>Datos invalidos</Text>
                        }
                    </View>
                    <View style={{marginTop:15}}>
                        {this.botones()}
                    </View>
                </View>
            </View>
        </Modal>
        )
    }
}

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const estilo = StyleSheet.create({
    check:{
        flexDirection:'row',
        width:ancho*0.7,
        justifyContent:'space-evenly',
        marginLeft:25,
        marginBottom:5,
        marginTop:15
    },  
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
        alignItems:'center'
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
        justifyContent:'center',
        width:Dimensions.get('window').width*0.3
    },
    selec:{
        borderColor:'green',
        borderRadius:30,
        borderWidth:1,
        height:55,
        width:55,
        alignItems:'center',
        justifyContent:'center'
    },
    no_selec:{
        borderRadius:30,
        alignItems:'center',
        justifyContent:'center'
    },
    botones:{
        flexDirection:'row', 
        justifyContent:'center', 
        width:Dimensions.get('window').width*0.7
    },
    icono:{
        color:'black',
        fontSize:30
    },
    icon:{
        color:'green',
        fontSize:30
    },
    item:{
        marginTop:10,
        marginBottom:10,
        width:ancho*0.9,
        height:40,
        justifyContent:'space-around',
        flexDirection:'row'
    },
})