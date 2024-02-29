import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet, AsyncStorage, Platform, Image} from "react-native";
import { Icon, Button,Text} from "native-base";
import store from '../../redux/store'
import {createId,createToken,setLocation} from '../../redux/actions'
import {server} from '../Api'
import NavigationService from '../../../NavigationService/NavigationService'
import Mensaje from './Mensajes';
import Tarjeta from './Tarjeta';
export default class EditTarjetas extends Component{
    constructor(){
        super()
        this.state={
            tarjetas:[],
            card:'',
            visible:false,
            mensaje:'',
            index:null,
            tarjeta:false,
            selected:false
        }
        this.setmensaje=this.setmensaje.bind(this)
        this.seleccionar=this.seleccionar.bind(this)
        this.cerrarTarjeta=this.cerrarTarjeta.bind(this)
        this.getTarjetas=this.getTarjetas
    }
    
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.visible&&this.state.tarjetas.length<1){
            this.getTarjetas()
            return true
        }
        return true
    }

    componentDidUpdate(prevProps,prevState){
        if(this.props.visible!==prevProps.visible&&this.props.visible){
            this.getTarjetas()
        }
    }

    seleccionar(i=null){
        if(store.getState().conexion==='conectado'){
            if(i!==null){
                let tarjetas=this.state.tarjetas
                tarjetas.splice(i,1)
                this.setState({tarjetas:tarjetas})
            }
            fetch(`${server}/cliente/`, {
                method:'PUT',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+store.getState().token.toString()
                },
                body:JSON.stringify({
                    _id:store.getState().id_user,
                    tarjetas:this.state.tarjetas
                })
            })
            .then(res=>{
                this.getTarjetas()
            })
            .catch(error=>alert(error))
        }
    }

    getTarjetas(){
        if(store.getState().conexion==='conectado'){
            fetch(`${server}/cliente/${store.getState().id_user}`, {
                method:'GET',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+store.getState().token.toString()
                }
            })
            .then(res=>{
                let data = JSON.parse(res._bodyInit)
                if(data.tarjetas.length>0){
                    this.setState({
                        tarjetas:data.tarjetas
                    })
                    let len = data.tarjetas.filter(el=>{
                        return el.default&&el.default===true
                    })
                    if(len.length<1) this.setState({selected:false})
                    this.setState({selected:true})
                }
            })
            .catch(error=>alert(error))
        }
    }

    renderImage(tipo){
        if(tipo==='Visa'){
            return(
                <Image
                    source={require('../../assets/images/visa.png')}
                    resizeMode='contain'
                    style={{height:20, width:45}}
                />
            )
        }else if(tipo==='Master Card'){
            return(
                <Image
                    source={require('../../assets/images/mastercard.jpeg')}
                    resizeMode='contain'
                    style={{height:20, width:45}}
                />
            )
        }else{
            return(
                <Image
                    source={require('../../assets/images/american_express.png')}
                    resizeMode='contain'
                    style={{height:20, width:40}}
                />
            )
        }
    }

    tarjetas(){
        let arr=[]
        for(let i=0;i<this.state.tarjetas.length;i++){
            arr.push(
                <View style={estilo.list} key={'list'+i}>
                    <Text>...{this.state.tarjetas[i].numero}</Text>
                    {this.renderImage(this.state.tarjetas[i].tipo)}
                    <View style={{flexDirection:'row', justifyContent:'space-between', width:60}}>
                        <Icon
                            name={this.state.tarjetas[i].default?
                                'checkmark-circle':'checkmark-circle-outline'
                            }
                            onPress={()=>{
                                let tarjetas=this.state.tarjetas
                                tarjetas.forEach((el,index)=>{
                                    if(i===index){
                                        tarjetas[i].default=true
                                    }else{
                                        tarjetas[index].default=false
                                    }
                                })
                                this.setState({tarjetas:tarjetas})
                                this.seleccionar()
                            }}
                            style={this.state.tarjetas[i].default?
                                {color:'green'}:{color:'black'}}
                        />
                        <Icon
                            name='trash'
                            onPress={()=>{
                                this.setState({visible:true,mensaje:'Esta seguro que desea eliminar esta tarjeta?', index:i})
                            }}
                        />
                    </View>
                </View>
            )
        }
        return arr
    }

    botones(){
        return(
            <View style={{flexDirection:'row', width:ancho*0.7,marginBottom:alto*0.01, justifyContent:'space-between'}}>
                <Button 
                    onPress={()=>{
                        this.props.arr_tarjetas(false)
                        if(!this.state.selected) this.props.setSelet('')
                    }}
                    rounded
                    dark>
                        <Text style={{color:'white', textAlign:'center'}}>Cancelar</Text>
                </Button>
                <Button
                    onPress={()=>{
                        if(this.state.selected){
                            if(this.props.saldo){
                                this.props.arr_tarjetas(false, true)
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
                            }else{
                                this.props.arr_tarjetas(false)
                            }
                        }
                    }}
                    rounded
                    danger>
                        <Text style={{color:'white', textAlign:'center'}}>Aceptar</Text>
                </Button>
            </View>
        )
    }

    setmensaje(data){
        this.setState({
            visible:data
        })
    }
    
    cerrarTarjeta(data){
        this.setState({
            tarjeta:data
        })
    }

    render(){
        return(
        <Modal
          visible={this.props.visible}
          transparent={true}
        >
            <Mensaje 
                visible={this.state.visible} 
                mensaje={this.state.mensaje} 
                setmensaje={this.setmensaje} 
                index={this.state.index}
                seleccionar={this.seleccionar}
            />
            <Tarjeta
                visible={this.state.tarjeta}
                cerrarTarjeta={this.cerrarTarjeta}
                getTarjetas={this.getTarjetas}
            />
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
                        Tarjetas
                        </Text>
                    </View>
                    <View style={{justifyContent:'flex-start'}}>
                        <View style={[estilo.razon,{flexDirection:'column', marginVertical:10}]}>
                            {this.tarjetas()}
                        </View>
                    </View>
                    <View style={{justifyContent:'center', width:ancho*0.8}}>
                        <Button 
                            rounded 
                            dark 
                            style={{alignSelf:'center',alignItems:'center',marginVertical:5, height:'auto'}}
                            onPress={()=>this.setState({tarjeta:true})}
                        >
                            <Text>Usar otra tarjeta</Text>
                        </Button>
                    </View>
                    <View >
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
        width:ancho*0.8,
        height:'auto'
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
    text_env:{

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
    list:{
        borderBottomColor:'#dfe2e5',
        borderTopColor:'#dfe2e5',
        borderBottomWidth:1,
        borderTopWidth:1,
        width:ancho*0.7,
        height:30,
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center'
    }
})