import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet, TouchableHighlight, Image, ScrollView} from "react-native";
import { Header, Icon, Button,Text} from "native-base";
import store from '../../redux/store'
import {withNavigationFocus} from 'react-navigation'
import {server} from '../Api'
import Cargando from '../Modals/Cargando'
import Condiciones from './Condiciones';
import Mensaje from '../Modals/Mensajes';
import {WebView} from 'react-native-webview'
import Tarjeta from './Tarjeta';
import firebase from 'react-native-firebase'
class Detalles extends Component{
    constructor(){
        super()
        this.state={
            visible:false,
            loading:false,
            show:false,
            mensaje:'',
            ver:false,
            tipo:'',
            opciones:false,
            tarjeta:false
        }
        this.cerrarTerminos=this.cerrarTerminos.bind(this)
        this.setmensaje=this.setmensaje.bind(this)
        this.setOpciones=this.setOpciones.bind(this)
        this.cerrarTarjeta=this.cerrarTarjeta.bind(this)
    }
    
    componentDidUpdate(prevProps,prevState){
        if(this.props.visible!==prevProps.visible&&this.props.visible===true&&this.props.reserva){
            this.crearTrans()
            if(this.props.reserva.tipo==='Tarjeta'){
                this.setState({mensaje:'Se esta realizando el cobro a tu tarjeta, espera un momento', ver:true})
                this.registrarPago()
            }
        }
        if(this.props.visible&&
        (this.props.pago!==prevProps.pago&&this.props.pago==='Rechazado'&&this.props.reserva.tipo==='Tarjeta')){
            this.setState({
                mensaje:'El pago ha sido rechazado, ¿desea probar con otra tarjeta o realizar su pago en efectivo?',
                ver:true,
                opciones:true
            })
        }
    }

    crearTrans(){
        fetch(`${server}/trans`,{
            method:'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString() 
            },
            body:JSON.stringify({
                cliente: store.getState().id_user,
                total: this.props.reserva.total,
                tipo: this.props.tipo,
                reserva:this.props.reserva._id
            })
        })
        .then(res=>{
        })
        .catch(error=>alert(error))
    }

    registrarPago(){
        if(this.props.conexion==='conectado'){
            if(this.props.tipo!=='PayPal'){
                this.setState({loading:true})
                fetch(`${server}/trans/pagos`,{
                    method:'POST',
                    headers:{
                        Accept: 'application/json',
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer '+store.getState().token.toString() 
                    },
                    body:JSON.stringify({
                        cliente: store.getState().id_user,
                        total: this.props.reserva.tipo==='Tarjeta'?  this.props.reserva.total.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : this.props.reserva.total,
                        tipo: this.state.opciones?this.state.tipo:this.props.tipo,
                        reserva: this.props.reserva._id
                    })
                })
                .then(res=>{
                    this.setState({loading:false})
                    if(this.state.mensaje.includes('espera un momento')) this.setState({ver:false})
                    let data = JSON.parse(res._bodyInit)
                    if(this.props.reserva.tipo!=='Tarjeta'||(this.state.opciones&&this.state.tipo!==''&&this.state.tipo!=='Tarjeta')){
                        if(data.message){
                            this.setState({
                                mensaje:'Ha ocurrido un error realizando su pago, ponganse en contancto con soporte',
                                ver:true
                            })
                            setTimeout(()=>this.props.terminar(),5000)
                        }else{ 
                            this.props.terminar()
                        }
                        this.setState({opciones:false,tipo:''})
                    }
                    if(this.props.pago==='Aprobado'&&this.state.tipo==='Tarjeta') this.setState({opciones:false,ver:false})
                }).catch(error=>{
                   this.setState({loading:false})
                    alert(error)
                })
            }    
            else {
                this.setState({visible:true})
            }
        }       
    }
    
    setOpciones(data){
        firebase.database().ref('/reserva/'+this.props.reserva._id+'/tipo').set(data)
            .then(()=>{
                this.setState({tipo:data, ver:false, tarjeta:data==='Tarjeta'?true:false})
                this.props.actTipo(data)
            })
            .catch(error=>alert(error))
    }

    handleResponse=data=>{
        if(this.props.conexion==='conectado'){
            let str = data.title.split('-')
            if(str[0]==='succes'){
                fetch(`${server}/trans/pagos`,{
                    method:'POST',
                    headers:{
                        Accept: 'application/json',
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer '+store.getState().token.toString() 
                    },
                    body:JSON.stringify({
                        cliente: store.getState().id_user,
                        total: this.props.reserva.total,
                        tipo: this.props.reserva.tipo,
                        reserva: this.props.reserva._id
                    })
                })
                .then(res=>{
                   this.setState({loading:false})
                   this.props.terminar()
                }).catch(error=>{
                   this.setState({loading:false})
                    alert(error)
                })
            }else{
                this.setState({
                    loading:false,
                    mensaje:'Ha ocurrido un error, por favor intentelo nuevamente',
                    ver:true
                })
            }
        }
    }

    modal(){
        if(this.props.reserva&&this.props.reserva.total){
            return(
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
                                    body:'costo='+this.props.reserva.total.toString()+'&cliente='+store.getState().id_user.toString()+'&reserva='+this.props.reserva._id.toString()
                                }}>
                            </WebView>
                        </Modal>
                </View>
            )
        }
        else{
            return null
        }
    }
    
    texto(){
        if(this.props.reserva.tipo==='Efectivo'||
        (this.props.reserva.tipo==='Tarjeta'&&this.props.pago==='Aprobado')) return 'Finalizar'
        return 'Pagar'
    }

    cerrarTerminos(data){
        this.setState({show:data})
    }

    setmensaje(data){
        this.setState({ver:data})
    }

    cerrarTarjeta(data){
        this.setState({tarjeta:data})
    }

    render(){
        if(!this.props.visible)
            // (!this.props.reserva.salida||!this.props.reserva.llegada
            // ||!this.props.reserva.costo||!this.props.reserva.tiempo_espera||!this.props.reserva.distancia
            // ||!this.props.reserva.duracion||!this.props.reserva.costo_tiempo_espera
            // ||!this.props.reserva.total))
        {
            return null
        }
        else{
            return(
                <Modal
                    visible={this.props.visible}
                    transparent={true}
                >
                    <Condiciones visible={this.state.show} cerrarTerminos={this.cerrarTerminos}/>
                    <Cargando visible={this.state.loading}/>
                    <Tarjeta visible={this.state.tarjeta} setmensaje={this.setmensaje} cerrarTarjeta={this.cerrarTarjeta}/>
                    <Mensaje 
                        visible={this.state.ver} 
                        mensaje={this.state.mensaje} 
                        setmensaje={this.setmensaje}
                        setOpciones={this.setOpciones}
                        opciones={this.state.opciones}
                    />
                    {this.modal()}
                    <View style={estilo.fondo}>
                        <View 
                            style={estilo.caja}
                        >
                            <ScrollView>
                                <View style={{width:ancho,height:'auto'}}>
                                    <Header
                                        style={estilo.head_2}
                                    >
                                        <Text style={{textAlign:'center', color:'white', fontSize:20}}>
                                            Detalles del pago
                                        </Text>
                                    </Header>
                                    <View style={{justifyContent:'flex-start',alignItems:"center", marginTop:5}}>
                                        <View style={estilo.item2}>
                                            <Text style={estilo.text}>Dirección de origen</Text>
                                            <Text numberOfLines={3} style={estilo.text2}>: {this.props.reserva.salida}</Text>
                                        </View>
                                        <View style={estilo.item2}>
                                            <Text style={estilo.text}>Dirección de destino</Text>
                                            <Text numberOfLines={3} style={estilo.text2}>: {this.props.reserva.llegada}</Text>
                                        </View>
                                        <View style={estilo.item}>
                                            <Text style={estilo.text}>Distancia total</Text>
                                            <Text style={estilo.text}>: {this.props.reserva.distancia}</Text>
                                        </View>
                                        <View style={estilo.item}>
                                            <Text style={estilo.text} numberOfLines={2} >
                                                Duración del recorrido (Mins)
                                            </Text>
                                            <Text style={estilo.text}>: {this.props.reserva.duracion}</Text>
                                        </View>
                                        <View style={estilo.item2}>
                                            <Text numberOfLines={2} style={estilo.text}>
                                            Tarifa por tiempo de espera ({this.props.reserva.tiempo_espera} Mins)
                                            </Text>
                                            <Text style={estilo.text}>: {this.props.reserva.costo_tiempo_espera?this.props.reserva.costo_tiempo_espera:'0'}</Text>
                                        </View>
                                        <View style={estilo.item}>
                                            <Text style={estilo.text}>Costo del viaje</Text>
                                            <Text style={estilo.text}>: 
                                                {this.props.reserva.costo?this.props.reserva.costo.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):'0.00'} $
                                            </Text>
                                        </View>
                                        <View style={estilo.item}>
                                            <Text style={estilo.text}>Total</Text>
                                            <Text style={estilo.text}>: 
                                            {this.props.reserva.total? this.props.reserva.total.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):'0.00'} $
                                            </Text>
                                        </View>
                                        <View style={estilo.item}>
                                            <Text style={estilo.text}>Método de pago</Text>
                                            <Text style={estilo.text}>:  
                                            {this.props.reserva.tipo? this.props.reserva.tipo:''} 
                                            </Text>
                                        </View>
                                        {this.props.reserva.tipo==='Tarjeta'&&
                                        <View style={estilo.item}>
                                            <Text style={estilo.text}>Estatus del pago</Text>
                                            <Text style={[estilo.text,{color:this.props.pago==='Pendiente'?'blue':this.props.pago==='Aprobado'?'green':'red'}]}>:  
                                            {this.props.pago? this.props.pago:''} 
                                            </Text>
                                        </View>}
                                        {this.props.reserva.tipo&&this.props.reserva.tipo==='Tarjeta'?
                                        <View style={[estilo.item,{justifyContent:'flex-end', marginBottom:5}]}>
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
                                        :null
                                        }
                                        <TouchableHighlight
                                            underlayColor='transparent'
                                            style={[estilo.item,{marginBottom:0}]}
                                            onPress={()=>this.setState({show:true})}
                                        >
                                            <Text style={{textAlign:'center', color:'#E84546'}}>Términos y condiciones</Text>
                                        </TouchableHighlight>
                                    </View>
                                    {(this.props.reserva.tipo!=='Tarjeta'||
                                    (this.props.pago==='Rechazado'&&this.props.reserva.tipo==='Tarjeta')||
                                    this.state.tipo!==''||this.props.pago==='Aprobado')&&
                                    <TouchableHighlight 
                                        onPress={()=>this.props.pago==='Aprobado'?this.props.terminar():this.registrarPago()} 
                                        underlayColor={'transparent'}
                                        style={{marginBottom:60, marginTop:-15}}
                                    >
                                        <View style={estilo.boton}>
                                            <Button
                                                onPress={()=>this.props.pago==='Aprobado'?this.props.terminar():this.registrarPago()}   
                                                rounded
                                                dark
                                                style={{justifyContent:'center', alignItems:'center',width:ancho*0.8}}
                                            >
                                                <Text style={{textAlign:'center'}}>
                                                    {this.texto()}
                                                </Text>
                                            </Button>
                                        </View>
                                    </TouchableHighlight>}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            )
        }
    }
}

export default withNavigationFocus(Detalles)

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const estilo = StyleSheet.create({
    head_2:{
        backgroundColor:'#E84546',  
        justifyContent:'center', 
        alignItems:'center',
        height:alto*0.15
    },
    fondo:{
        flex:1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#000000c2'
    },
    caja:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#fff',
        borderRadius: 25,
        height:alto,
        width:ancho
    },
    item:{
        marginTop:10,
        marginBottom:10,
        width:ancho*0.9,
        height:20,
        justifyContent:'space-around',
        flexDirection:'row'
    },
    item2:{
        marginTop:20,
        marginBottom:10,
        width:ancho*0.9,
        height:35,
        justifyContent:'space-around',
        flexDirection:'row'
    },
    text:{
        width:ancho*0.45,
        color:'black',
        fontWeight:'bold',
        fontSize:15,
        textAlign:'left'
    },
    text2:{
        width:ancho*0.45,
        height:35,
        color:'black',
        fontWeight:'bold',
        fontSize:15,
        textAlign:'left'
    },
    boton:{
        marginTop:30,
        alignSelf:'center'
    }
})