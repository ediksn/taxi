import React, { Component} from 'react'
import { Modal,Platform ,View, Dimensions, StyleSheet, Picker} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Input, List, CheckBox} from "native-base";
import {withNavigationFocus} from 'react-navigation'
import store from '../../redux/store'
import {server} from '../Api'
import Tarjeta from './Tarjeta';
import EditTarjetas from './EditTarjetas';
class Promo extends Component{
    constructor(){
        super()
        this.state={
            tipos: [],
            selet:'',
            default:false,
            tipo_def:'',
            tarjeta:false,
            arr_tarjetas:false,
            card:false
        }
        this.cerrarTarjeta=this.cerrarTarjeta.bind(this)
        this.cerrarArr_tarjetas=this.cerrarArr_tarjetas.bind(this)
        this.setSelet=this.setSelet.bind(this)
    }
    
    componentDidMount(){
        this.setState({selet:''})
        this.getTipos()
        this.getDefault()
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.visible!==this.props.visible&&this.props.visible===true){
            this.getDefault()
        }
    }

    getTipos(){
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

    getDefault(){
        fetch(`${server}/cliente/${store.getState().id_user}`,{
            method:'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            }
        })
        .then(response=>{
            let data = JSON.parse(response._bodyInit)
            this.setState({
                tipo_def:data.tipo_def?data.tipo_def:'',
                selet:data.tipo_def?data.tipo_def.toString():'',
                default:data.tipo_def?true:false,
                card:data.tarjetas&&data.tarjetas.length>0?true:false
            })
            if((data.tarjetas&&data.tarjetas.length<1&&data.tipo_def==='Tarjeta')||
            !data.tarjetas&data.tipo_def==='Tarjeta'){
                this.props.addTipo('')
            }
        })
        .catch(error=>{
            alert(error)
        })
    }

    setDefault(){
        fetch(`${server}/cliente`,{
            method:'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body:JSON.stringify({
                _id:store.getState().id_user,
                tipo_def: this.state.selet
            })
        })
        .then(response=>{
        })
        .catch(error=>{
            alert(error)
        })
    }

    options(){
        let arr = []
        arr.push(<Picker.Item key={'p'} label='...Seleccione' value=''/>)
        for( let i = 0; i<this.state.tipos.length; i++){
            arr.push(
                <Picker.Item key={'p'+i} label={this.state.tipos[i].nombre.toString()} value={this.state.tipos[i].nombre.toString()}/>
            )
        }
        return arr
    }

    cerrarTarjeta(data){
        this.setState({
            tarjeta:data
        })
    }

    cerrarArr_tarjetas(data){
        this.setState({
            arr_tarjetas:data
        })
    }

    setSelet(data){
        this.setState({selet:data})
    }

    render(){
        return(
        <Modal
          visible={this.props.visible}
          transparent={true}
        >
            <Tarjeta visible={this.state.tarjeta} cerrarTarjeta={this.cerrarTarjeta} setSelet={this.setSelet}/>
            <EditTarjetas 
                ref={ref=>this.tarjetas=ref} 
                visible={this.state.arr_tarjetas} 
                arr_tarjetas={this.cerrarArr_tarjetas} 
                setSelet={this.setSelet}
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
                    paddingBottom: Platform.select({ios:5, android:20}),
                    borderRadius: 25,
                    height: Platform.select({ios:alto*0.45,android:alto / 3}),
                    width:ancho - 40
                }}
                >
                    <View style={estilo.titulo}>
                        <Icon
                            name='card'
                            style={{color:'white'}}
                        />
                        <Text style={estilo.text}>
                        Metodo de pago
                        </Text>
                    </View>
                    <View style={
                        Platform.OS === 'android' ?
                        {justifyContent:'center', alignItems:'center', flex:1} :
                        {justifyContent:'center', alignItems:'center', flex:1, marginTop:45}
                    }>
                        <View 
                            style={{
                                flex:Platform.select({ios:1,android:1}),
                                flexDirection:'row', 
                                alignItems:'center', 
                                justifyContent:'center'
                            }}
                        >   
                            <Picker
                                mode={"dropdown"}
                                selectedValue={this.state.selet}
                                style={{
                                    height: Platform.select({ios:alto*0.38,android:alto*0.1}), 
                                    width: ancho*0.6,
                                }}
                                onValueChange={(itemValue, itemIndex) =>{
                                    if(itemValue===''&&this.state.tipo_def!==''){
                                        this.setState({selet: this.state.tipo_def.toString(), default:true})
                                    }else{
                                        this.setState({selet: itemValue})
                                    }
                                    if(itemValue===this.state.tipo_def){
                                        this.setState({
                                            default:true
                                        })
                                    }
                                    else{
                                        this.setState({
                                            default:false
                                        })
                                    }
                                }}>
                                {this.options()}
                            </Picker>
                            {this.state.selet==='Tarjeta' &&
                                <Icon
                                    name='eye'
                                    style={{marginLeft:5,fontSize:30, color:'#676767'}}
                                    onPress={()=>{
                                        if(this.state.card){
                                            this.tarjetas.getTarjetas()
                                            this.setState({arr_tarjetas:true})
                                        }else{
                                            this.setState({tarjeta:true})
                                        }
                                    }}
                                />
                            }
                        </View>
                        <View style={{
                            flex:1,
                            justifyContent:'space-around', 
                            alignItems:'center', 
                            flexDirection:'row',
                            width:ancho*0.6
                        }}>
                            <CheckBox
                                color='green'
                                checked={this.state.default}
                                onPress={()=>{
                                    if(this.state.selet!==''){
                                        this.setState({default:!this.state.default})
                                    }}
                                }
                            />
                            <Text>Seleccionar por defecto</Text>
                        </View>
                        <View style={estilo.botones}>
                            <Button 
                                onPress={()=>{
                                    if(this.state.selet==='')this.props.addTipo('')
                                    this.props.pago(false)
                                }}
                                rounded
                                info
                                style={estilo.boton_1}>
                                    <Text style={{color:'white', textAlign:'center'}}>Cancelar</Text>
                            </Button>
                            <Button 
                                onPress={()=>{
                                    this.props.addTipo(this.state.selet)
                                    this.props.pago(false)
                                    this.setState({selet:''})
                                    this.setDefault()
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
            </View>
        </Modal>
        )
    }
}

export default withNavigationFocus(Promo)

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
        height:alto*0.06
    },
    btn_pago:{
        marginTop:alto*0.01,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:ancho*0.7,
        height:alto*0.06
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
        flex:1,
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