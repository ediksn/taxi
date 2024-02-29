import React, { Component} from 'react'
import { Modal,View, Dimensions, StyleSheet} from "react-native";
import {  Icon,  Button, Text } from "native-base";
import store from '../../redux/store'
import {server} from '../Api'
export default class Booking extends Component{
    constructor(){
        super()
        this.state={
            razon:'',
            item:'',
            estado:'',
            transac: {},
            user:{},
            visible:false
        }
    }

    componentDidMount(){
        this.getUser()
    }

    botones(){
        if(this.state.estado===''){
            return(
                <View style={estilo.botones}>
                    <Button 
                        onPress={()=>{
                            this.props.setBooking()
                        }}
                        rounded
                        info
                        style={estilo.boton_1}>
                            <Text style={{color:'white', textAlign:'center'}}>Cancelar</Text>
                    </Button>
                    <Button 
                        onPress={()=>{
                            this.setState({estado:this.props.tipo})
                            this.agendar()
                        }}
                        rounded
                        danger
                        style={estilo.boton_2} 
                        >
                        <Text style={{color:'white', textAlign:'center',marginLeft:10}}>Enviar</Text>
                    </Button>
                </View>
            )
        }
        else{
            return(
                <View style={estilo.botones}>
                    <Button 
                        onPress={()=>{
                            this.props.setBooking()
                        }}
                        rounded
                        info
                        style={[estilo.boton_1, {justifyContent:'center'}]}>
                        <Text style={{color:'white', textAlign:'center'}}>Ok</Text>
                    </Button>
                </View>
            )
            
        }
    }

    mensaje(){
        if(this.state.estado===''){
            return(
                <View style={[estilo.razon,{flexGrow:0.5}]}>
                    <Text numberOfLines={2} style={{fontSize:20, textAlign:'center', flexWrap:'wrap'}}>¿Confirmar reserva para {JSON.stringify(this.props.time)}?</Text>
                </View>
            )
        }
        else{
            return(
                <View style={[estilo.razon,{flexGrow:0.5}]}>
                    <Text style={{fontSize:20, textAlign:'center',flexWrap:'wrap'}}>No tiene suficiente saldo para realizar este viaje</Text>
                </View>
            )
        }
    }

    principal(){
        return(
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
                    height:alto / 3.5,
                    width:ancho - 40
                  }}
                >
                    <View style={estilo.titulo}>
                        <Icon
                            name='time'
                            style={{color:'white'}}
                        />
                        <Text style={estilo.text}>
                          Reserva
                        </Text>
                    </View>
                    <View style={{justifyContent:'flex-start'}}>
                        {this.mensaje()}
                    </View>
                    {this.botones()}
                </View>
            </View>
        )
    }

    showModal(){
        switch(this.state.estado){
        case '':
            return(
                this.principal()
            )
            break
        case 'PayPal':
            this.props.setBooking(null,false,null,true)
            this.props.cancelar()
            this.setState({estado:'', user:{}})
            break
        case 'Saldo':
            if(JSON.parse(this.state.user.saldo)<JSON.parse(this.props.costo)){
                return(
                    this.principal()
                )
            }
            else{
                this.props.setBooking(null,false,null,true)
                this.props.cancelar()
                this.setState({estado:'', user:{}})
            }
        case 'Efectivo':
            this.props.setBooking(null,false,null,true)
            this.props.cancelar()
            this.setState({estado:'', user:{}})
        }
    }

    getUser(){
        if(this.props.conexion==='conectado'){
            fetch(`${server}/cliente/${store.getState().id_user.toString()}`,{
                method:'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
                }
            })
            .then(res=>{
                this.setState({user:JSON.parse(res._bodyInit)})
            })
            .catch(error=>alert(error))
        }
    }

    handleResponse=data=>{
        if(this.props.conexion==='conectado'){
            let str = data.title.split('-')
            if(str[0]==='succes'){
                this.props.setBooking(null,false,null,true)
                this.props.crearViaje()
                this.props.cancelar()
                this.setState({estado:''})
            }
        }
    }

    agendar(){
        if(this.props.conexion==='conectado'){
            this.props.crearViaje()
            this.props.setBooking(null,false,null,true)
            this.props.cancelar()
            this.setState({estado:''})
        }
    }

    render(){
        return(
        <Modal
          visible={this.props.visible}
          transparent={true}
        >
          {this.showModal()}
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
        width:ancho - 40,
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
        width:ancho*0.7,
        height:alto*0.05
    },
    boton_1:{
        marginTop:1,
        height:30,
        width:ancho*0.3,
        backgroundColor:'#676767'
    },
    boton_2:{
        marginTop:1,
        height:30,
        width:ancho*0.3
    },
    text_env:{

    },
    botones:{
        flexDirection:'row', 
        justifyContent:'space-around', 
        width:ancho*0.7
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