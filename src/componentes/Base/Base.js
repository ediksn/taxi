import React, { Component} from 'react'
import { View, StyleSheet, Dimensions, AsyncStorage, TouchableHighlight,Platform, Image } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, CheckBox } from "native-base";
import store from '../../redux/store'
import {server, sock} from '../Api/index'
import moto from '../../assets/images/moto.png'
import roja from '../../assets/images/roja.png'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import 'moment/locale/es'

moment.locale('es')

export default class Base extends Component{
    constructor(){
        super()
        this.state={
          seleccionado:'taxi',
          datePickerVisible:false,
          book:false,
          altura:80,
          fecha: null,
          check:false,
        }
        this.showDateTimePicker= this.showDateTimePicker.bind(this)
        this.hideDateTimePicker = this.hideDateTimePicker.bind(this)
        this.handleDateTimePicker = this.handleDateTimePicker.bind(this)
    }

    showDateTimePicker(){
        this.setState({
            datePickerVisible:true
        })
    }

    hideDateTimePicker(){
        this.setState({
            datePickerVisible:false
        })
    }

    handleDateTimePicker(date){
        this.hideDateTimePicker()
        this.setState({book:false})
        if(Platform.OS==='android'){
            this.props.setBooking(time=moment(date).format('MMMM Do YYYY, h:mm a'),book=true, booking=date)
        }else{
            setTimeout(
                ()=>this.props.setBooking(time=moment(date).format('MMMM Do YYYY, h:mm a'),book=true, booking=date),
                1500
            )
        }
    }

    confirmar(){
        if(this.props.costo!==null){
            if(this.props.tipo===''){
                this.props.pago(true)
                this.props.addPay('no')
                this.setState({check:false})
            }
            else{
                this.props.cambiarEstado('confirmar')
            }
        }
    }

    text(){
        if(this.props.cant<1){
            return(
                <Text style={style.text}>
                     No hay coches disponibles
                </Text>
            )
        }
        else{
            return(
                <Text style={style.text}>
                     {this.props.cant} Coche(s) Disponible(s)
                </Text>
            )
        }
    }

    mostrarHora(){
        if(this.state.book===true){
            return(
                <View style={{alignSelf:'center'}}>
                        <Button 
                            danger
                            rounded 
                            style={{
                                width:Dimensions.get('window').width*0.7,
                                height:Dimensions.get('window').height*0.06,  
                                justifyContent:'center'}} 
                            onPress={()=>{
                                if(this.props.tipo===''){
                                    this.props.pago(true)
                                    this.props.addPay('no')
                                }
                                else{
                                    this.showDateTimePicker()
                                    // this.props.setBooking(null,true,null,false)
                                }
                            }}>
                            <Text style={{textAlign:'center'}}>Agendar reserva</Text>
                        </Button>
                        <DateTimePicker
                            mode='datetime'
                            confirmTextIOS='Aceptar'
                            cancelTextIOS='Cancelar'
                            customTitleContainerIOS={<Text style={{textAlign:'center'}}>Seleccione una fecha</Text>}
                            isVisible={this.state.datePickerVisible}
                            onConfirm={Platform.OS==='ios'?()=>this.handleDateTimePicker(): this.handleDateTimePicker}
                            onCancel={Platform.OS==='ios'?()=>this.hideDateTimePicker():this.hideDateTimePicker}
                        >
                        </DateTimePicker>
                    </View>
            )
        }
        else{
            return(
                <TouchableHighlight underlayColor={'transparent'} onPress={()=>this.confirmar()}>
                    <View style={{alignSelf:'center', paddingBottom:5}}>
                        <Button
                            disabled={this.props.costo!==null?false:true} 
                            onPress={()=>this.confirmar()}
                            rounded
                            style={{backgroundColor:'black',justifyContent:'center' ,width:Dimensions.get('window').width*.9}}>
                                <Text style={{color:'white', textAlign:'center'}}>Solicitar Taxi</Text>
                        </Button>
                    </View>
                </TouchableHighlight>
            )
        }
    }

    getTipos(){
        if(this.props.conexion==='conectado'){
            fetch(`${server}/tipo_pago`,{
                method:'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type':'application/json',
                  'Authorization': 'Bearer '+store.getState().token.toString()
                }
            })
            .then(response=>{
                let data = JSON.parse(response._bodyInit)
                this.setState({tipos:data})
            })
            .catch(error=>{
                alert(error)
            })
        }
    }

    getViaje(destino){
        if(this.props.conexion==='conectado'){
            fetch(`${server}/api/cliente/`+store.getState().id_user.toString(),{
              method:'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
              }
            })
            .then(response=>{
                let data  = JSON.parse(response._bodyText)
                fetch(`${server}/api/reserva/consulta`,{
                    method:'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        origen:data.map,
                        destino:destino
                    })
                })
                .then(response=>{
                    let data = JSON.parse(response._bodyText)
                    AsyncStorage.setItem('estado','confirmar')
                })
                .catch(error=>{
                    alert(error)
                })
            })
            .catch(error=>{
            alert(error)
            })
        }
      }
      cambiarseleccionado(estado){
        this.setState({
          seleccionado:estado
        })
      }

      resolverCosto(costo){
          if(typeof(costo)==='string'){
              return costo.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
          }
          else if(costo===null){
              return ''
          }
          else{
              costo.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
          }
      }

    render(){
        return(
            <View style={style.view}>
                <Card style={style.fondo}>
                    <View style={style.titulo}>
                        {this.text()}
                    </View> 
                    <View style={style.contenedor}>
                        <View style={style.boton}>
                            <TouchableHighlight underlayColor='transparent' 
                                onPress={()=>{
                                    this.cambiarseleccionado('taxi') 
                                    this.props.setVehiculo('Taxi')}}>
                                <View  style={this.state.seleccionado == 'taxi' ? style.seleccionado : style.icono}>
                                <Icon style={this.state.seleccionado == 'taxi' ? style.icon_seleccionado : style.icon} name='car' />
                                    <Text style={this.state.seleccionado == 'taxi' ? style.tipo_text_seleccionado : style.tipo_text}>Taxi</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={style.boton}>
                            <View style={style.tiempo}>
                                <Icon style={style.icon_time} name='time' 
                                    onPress={()=>this.setState({
                                        book:!this.state.book
                                    })}
                                />
                            </View>
                            <Text>{this.props.duration} min</Text>
                            <Text>{this.resolverCosto(this.props.costo)} $</Text>
                        </View>
                        <View style={style.boton}>
                            <TouchableHighlight underlayColor='transparent' onPress={()=>{
                                this.cambiarseleccionado('moto')
                                this.props.setVehiculo('Moto')
                            }}>
                                <View style={this.state.seleccionado == 'moto' ? style.seleccionado : style.icono}>
                                    <Image style={this.state.seleccionado == 'moto' ? style.img_sele : style.img} 
                                    source={this.state.seleccionado == 'moto' ?roja:moto}/>
                                    <Text style={this.state.seleccionado == 'moto' ? style.tipo_text_seleccionado : style.tipo_text}>Tricycle</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    
                    <View style={style.content}>
                        <TouchableHighlight underlayColor='transparent' onPress={()=>this.props.pago(true)}  >
                            <View style={style.informacion}>
                                <Icon 
                                    style={{fontSize: 20, color: '#676767', marginRight: 10}} name='card' 
                                      
                                />
                                <Text style={{fontSize: 14, color: '#676767', width: 60}}>Metodo de Pago</Text>
                            </View>
                        </TouchableHighlight>
                        
                        {/*<TouchableHighlight underlayColor='transparent' onPress={()=>this.props.promo(true)} >
                            <View style={style.borde_promo}>            
                                <Icon 
                                    style={{fontSize: 20, color: '#676767', marginRight: 10}} name='cut'                            
                                    />  
                                <Text style={{fontSize: 14, color: '#676767'}}>Promo</Text>
                            </View>
                        </TouchableHighlight>*/}
                        <TouchableHighlight underlayColor='transparent' onPress={()=>this.props.cerrarExtras()}>
                            <View style={style.borde_promo}>    
                                <Icon style={{fontSize: 20, color: '#676767', marginRight: 10}} name='people' 
                                />
                                <Text style={{fontSize: 14, color: '#676767'}}>1-4</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='transparent'>
                            <View style={style.check}>
                                <CheckBox
                                    color='red'
                                    checked={this.state.check}
                                    onPress={()=>{
                                        this.setState({check:!this.state.check})
                                        this.props.setIdaVuelta(!this.state.check)
                                    }}
                                />
                                <Text style={{fontSize:14, color: '#676767'}}>
                                    Ida y Vuelta
                                </Text>
                            </View>
                        </TouchableHighlight>    
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center', marginBottom:10}}>
                        {this.mostrarHora()}
                    </View>
                </Card>
            </View>
            
        )
    }
}

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const style = StyleSheet.create({
    tipo_text_seleccionado: {
        fontSize: 8,
        color: 'red'
    },
    icon_seleccionado:{
        fontSize:40,
        color: 'red'
    },
    img_sele:{
        color:'red',
        width:40,
        height:40
    },
    seleccionado: {
        justifyContent: 'center',
        alignItems: 'center',
        width:60,
        color: '#E84546',
        height:60,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: 'red'
    },
    borde_promo: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        paddingHorizontal:20,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#676767'
    },
    informacion: {
        paddingHorizontal:20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    check:{
        flexDirection:'row',
        justifyContent:'space-around',
        width:150
    },
    contenedor:{
        flexDirection: 'row',
        marginHorizontal: 50,
        height: 80,
        backgroundColor:'#fff',
        justifyContent: 'space-around',
        alignItems: 'center',  
    },
    precio: {
        fontWeight: 'normal',
        color: '#E84546'
    },
    tipo_text: {
        fontSize: 8
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
    view:{
        margin: 0
    },
    text: {
        color:'white'
    },
    icon:{
        fontSize:40
    },
    img:{
        height:40,
        width:40
    },
    icon_time:{
        fontSize:20,
        color: 'red'
    },  
    titulo:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        backgroundColor: '#E84546',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        
    },
    boton:{
        justifyContent: 'center',
        alignItems: 'center',  
        color: '#E84546'
    },
    icono:{
        justifyContent: 'center',
        alignItems: 'center',
        width:60,
        color: '#E84546',
        height:60,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: '#676767'
    },
    tiempo:{
        justifyContent: 'center',
        alignItems: 'center',
        width:30,
        color: '#E84546',
        height:30,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#676767'
    },
    fondo:{
        marginBottom: -1,
        margin:0,
        marginHorizontal: 0,
        backgroundColor:'#FFFFFF',
        height: 220,
        width:Dimensions.get('window').width + 1
    },
    fondo_2:{
        marginBottom: -1,
        margin:0,
        marginHorizontal: 0,
        backgroundColor:'#FFFFFF',
        height: 260,
        width:Dimensions.get('window').width + 1,
        flexDirection:'column',
        alignContent:'flex-start'
    },
    content:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        height:50,
        flexDirection: 'row',
        marginHorizontal: 0,
        marginBottom: 10,
        marginTop: 5,
    }
})