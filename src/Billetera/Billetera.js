import React from "react";
import {  StyleSheet, Dimensions,Modal} from "react-native";
import { Container, Icon, Button, Content,Text,  View, Input} from "native-base";
import {withNavigationFocus} from 'react-navigation'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {server} from '../componentes/Api'
import {WebView} from 'react-native-webview'
import Mensaje from "../componentes/Modals/Mensajes.js";
import Cargando from "../componentes/Modals/Cargando";
import Tarjeta from "../componentes/Modals/Tarjeta.js";
import EditTarjetas from "../componentes/Modals/EditTarjetas.js";
class Billetera extends React.Component {
  constructor(){
    super()
    this.state={
      location:'Favoritos',
      saldo:'',
      visible:false,
      user_saldo:0,
      message: '',
      estatus:'',
      block:0,
      mensaje:'',
      show:false,
      tarjeta:false,
      varias:false,
      tarjetass:false,
      loading:false
    }
    this.setmensaje=this.setmensaje.bind(this)
    this.cerrarTarjeta=this.cerrarTarjeta.bind(this)
    this.arr_tarjetas=this.arr_tarjetas.bind(this)
    this.setOpcion=this.setOpcion.bind(this)
  }

  componentDidMount() {
    this.getSaldo()
  }


  componentDidUpdate(prevProps){
      if(this.props.isFocused!==prevProps.isFocused&&this.props.isFocused===true){
        this.getSaldo()
      }
  }

    enviar(){
        if(this.state.saldo!==''){
            this.setState({show:true, mensaje:'¿Cómo desea abonar a su saldo?'})
        }
    }

    setOpcion(data){
        if(data==='PayPal'){
            this.setState({visible:true, show:false})
        }else this.state.varias?this.setState({tarjetass:true,show:false}):this.setState({tarjeta:true,show:false})
    }

    getSaldo(){
        if(store.getState().conexion==='conectado'){
            fetch(`${server}/cliente/`+store.getState().id_user.toString(),{
                method:'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
                }
            })
            .then(res=>{
                let data = JSON.parse(res._bodyInit)
                this.setState({
                    user_saldo:data.saldo,
                    block:data.bloqueado&&data.bloqueado>0?data.bloqueado:0,
                    varias:data.tarjetas&&data.tarjetas.length>0?true:false
                })
            })
            .catch(error=>{
                alert(error)
            })
        }
    }

  showMensaje(){
      if(this.state.message===''){
          return(
            <View style={{flex:5, justifyContent:'center', alignItems:'center'}}>
                <Text style={{color:'black', fontSize:20, textAlign:'center'}}>
                ¿Seguro que desea agregar la cantidad de {this.state.saldo}$ a su billetera?
                </Text>
            </View>
          )
      }
      else if(this.state.message==='no'){
        return(
          <View style={{flex:5, justifyContent:'center', alignItems:'center'}}>
              <Text style={{color:'black', fontSize:20, textAlign:'center'}}>
              Ingrese un monto a abonar a su saldo
              </Text>
          </View>
        )
    }
      else{
          return(
            <View style={{flex:5, justifyContent:'center', alignItems:'center'}}>
                <Text style={{color:'black', fontSize:20, textAlign:'center'}}>
                Gracias por usar nuestra billetera, en breve le será abonado su saldo luego de ser aprobado
                </Text>
            </View>
          )
      }
  }


  handleResponse=data=>{
    if(store.getState().conexion==='conectado'){
        let str = data.title.split('-')
        if(str[0]==='succes'){
            this.setState({estatus:'', message:'aprobado'})
            this.getSaldo()
        }
    }
  }

  texto(){
    if(this.state.block>0){
        return (
            <Text style={{textAlign:'center', fontSize:25}}>
                Bloqueado RD$<Text style={{fontSize:25, color:'red'}}>{this.state.block?this.state.block.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):''}</Text>
            </Text>
        )
    }
    else{
        return(
            <Text style={{textAlign:'center', fontSize:25}}>
                RD$<Text style={{fontSize:25, color:'red'}}>{this.state.user_saldo?this.state.user_saldo.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):''}</Text>
            </Text>
        )
    }
  }

  modalPrincipal(){
      if(this.state.estatus==='pago'){
        return(
            <View style={{height:alto}}>
                <Button 
                    onPress={()=>this.setState({estatus:'', message:''})}
                    style={{width:ancho*0.15, height:alto*0.08, justifyContent:'flex-end'}}>
                    <Icon
                        name='arrow-back'
                        style={{color:'white', fontSize:25}}
                    />
                </Button>
                <WebView
                    style={{height:alto*0.92}}
                    onNavigationStateChange={data=>this.handleResponse(data)}    
                    source={{uri: `${server}/trans/paypal`,
                        method: 'POST',
                        body:'costo='+this.state.saldo
                        +'&cliente='+store.getState().id_user.toString()
                        +'&tipo=recarga'
                    }}
                >
                </WebView>
            </View>
        )
      }
      else{
        return(
            <View style={estilo.modal}>
                <View style={estilo.modal_view}>
                    <View style={estilo.modal_header}>
                        <Icon
                            name='ios-warning'
                            style={{color:'white'}}
                        />
                        <Text style={{textAlign:'center', color:'white', fontSize:20}}>Atencion</Text>
                    </View>
                    {this.showMensaje()}
                    {this.modalBotones()}
                </View>
            </View>
        )
      }
  }

  modalBotones(){
      if(this.state.message===''){
          return(
            <View style={estilo.modal_botons}>
                <Button
                    style={{justifyContent:'center', width:ancho*0.3}} 
                    rounded
                    dark
                    onPress={()=>this.setState({visible:false, saldo:''})}>
                    <Text>cancelar</Text>
                </Button>
                <Button
                    style={{justifyContent:'center',width:ancho*0.3}} 
                    rounded
                    danger
                    onPress={()=>this.setState({estatus:'pago'})}>
                    <Text>aceptar</Text>
                </Button>
            </View>
          )
      }
      else{
          return(
            <View style={estilo.modal_botons}>
                <Button
                    style={{justifyContent:'center', width:ancho*0.3}} 
                    rounded
                    dark
                    onPress={()=>this.setState({visible:false, saldo:'', message:''})}>
                    <Text>Ok</Text>
                </Button>
            </View>
          )
      }
  }

  setmensaje(data, mensaje=this.state.mensaje){
    this.setState({show:data, mensaje:mensaje})
    if(mensaje.includes('Gracias')){ 
        this.setState({saldo:'', loading:false})
        this.getSaldo()
    }
    if(mensaje.includes('rechazada')){
        this.setState({loading:false})
    }
  }

  cerrarTarjeta(data, loading=false){
    this.setState({tarjeta:data, loading:loading})
  }

  arr_tarjetas(data,loading=false){
    this.setState({tarjetass:data, loading:loading})
  }

  render() {
    return (
      <Container>
        <Mensaje 
            visible={this.state.show} 
            mensaje={this.state.mensaje} 
            setmensaje={this.setmensaje} 
            setOpcion={this.setOpcion}
        />
        <Tarjeta visible={this.state.tarjeta} saldo={this.state.saldo} setmensaje={this.setmensaje} cerrarTarjeta={this.cerrarTarjeta}/>
        <EditTarjetas saldo={this.state.saldo} visible={this.state.tarjetass} setmensaje={this.setmensaje} arr_tarjetas={this.arr_tarjetas}/>
        <Cargando visible={this.state.loading}/>
        <Head name={'Billetera'} navigation={this.props.navigation}/>
        <View style={estilo.content}>
        <View>
            <Modal visible={this.state.visible}>
                {this.modalPrincipal()}
            </Modal>
        </View>
            <Content style={estilo.back}>
                <View style={estilo.content}>
                  <View style={estilo.cont}>
                    <View style={estilo.money}>
                        {this.texto()}
                    </View>
                    <View style={{justifyContent:'center', alignContent:'center'}}>
                        <Icon
                            name='cash'
                            style={estilo.user}
                        />
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'center'}}>
                        <Icon
                            name='ios-warning'
                        />
                        <Text style={{textAlign:'center'}}>
                            Pase efectivo y sin problemas con la billetera Appolotaxi
                        </Text>
                    </View>
                  </View>
                  <View style={estilo.titulo}>
                        <Text style={estilo.title_text}>Recarga dinero</Text>
                  </View>
                  <View style={{justifyContent:'center', alignItems:'center'}}>
                  <View style={estilo.botones}>
                    <View style={estilo.boton}>
                        <Button style={estilo.cash} 
                            rounded
                            onPress={()=>this.setState({saldo:100})}
                        >
                        <Text style={[estilo.bot_text,{width:'120%'}]}>100</Text></Button>
                    </View>
                    <View style={estilo.boton}>
                        <Button style={estilo.cash} 
                            onPress={()=>this.setState({saldo:200})}
                            rounded>
                            <Text style={[estilo.bot_text,{width:'120%'}]}>200</Text></Button>
                    </View>
                    <View style={estilo.boton}>
                        <Button style={estilo.cash} 
                            onPress={()=>this.setState({saldo:300})}
                            rounded>
                            <Text style={[estilo.bot_text,{width:'120%'}]}>300</Text></Button>
                    </View>
                  </View>
                  </View>
                    <View style={estilo.send}>
                        <Text style={{color:'red', marginLeft:ancho*0.01}}>RD$</Text>
                        <Input keyboardType={'numeric'} placeholder='Ingresa un monto' value={this.state.saldo.toString()} onChangeText={text=>this.setState({saldo:text})}>
                        </Input>
                        <Button
                            onPress={()=>this.enviar()} 
                            rounded 
                            style={{height:alto*0.048, backgroundColor:'red'}}>
                            <Text>Enviar</Text>
                        </Button>
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:alto*0.06}}>
                        {/*<Text style={{textAlign:'center', color:'red', fontSize:20}}>¿Tienes un Promcode?</Text>*/}
                        {/*<Button dark rounded style={{width:ancho*0.8, justifyContent:'center', marginTop:alto*0.025}}>
                            <Icon
                                name='add'
                                style={{color:'white', fontSize:30}}
                            />
                            <Text style={{color:'white', fontSize:20, textAlign:'center'}}>Agregar dinero</Text>
                        </Button>*/}
                    </View>
                </View>
            </Content>
        </View>
      </Container>
    );
  }
}

export default withNavigationFocus(Billetera)

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const estilo = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        //marginLeft:-Dimensions.get('window').height*0.015
    },
    cont:{
        justifyContent:'center',
        alignItems:'center',
        width:ancho*0.90,
        height: alto*0.37
    },
    item_text:{
        color:'grey',
        fontSize:20,
        textAlign:'left',
        marginLeft:alto*0.03
    },
    send:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center', 
        marginTop: alto*0.03,
        borderWidth:1,
        borderColor:'red',
        borderRadius:20,
        height:alto*0.05,
        width:ancho*0.95
    },  
    titulo:{
        backgroundColor:'#818181', 
        justifyContent:'center',
        borderBottomLeftRadius:15, 
        borderBottomRightRadius:15, 
        height:alto*0.05, 
        width:ancho
    },
    modal:{
        flex:1,
        backgroundColor:'#000000c2', 
        justifyContent:"center", 
        alignItems:'center'
    },
    modal_view:{
        justifyContent:'center',
        backgroundColor:'#fff',
        width: ancho*0.9,
        height: alto*0.3,
        borderRadius:25
    },  
    modal_header:{
        backgroundColor:'#E84546',
        width: ancho*0.9,
        height: alto*0.05,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        justifyContent:'center',
        flex:1,
        flexDirection:'row'
    },
    modal_botons:{
        flexDirection:'row', 
        justifyContent:'space-evenly', 
        marginBottom:alto*0.01
    },
    user:{
        fontSize:alto*0.2,
        height:alto*0.2,
        color:'red'
    },
    codigo:{
        width:ancho*0.3, 
        backgroundColor:'red', 
        height:alto*0.05
    }, 
    money:{
        marginTop:-(alto*0.058),
        alignItems:'center',
        justifyContent:'flex-start',
        width:ancho, 
        backgroundColor:'#e9e9e9', 
        height:alto*0.05
    },
    title_text:{
        fontSize:20,
        color:'white',
        textAlign:'center'
    },
    cash:{
        backgroundColor:'red',
        width:ancho*0.25,
        height: alto*0.05,
        alignItems:'center'
    },  
    back: {
        backgroundColor:'white', 
        borderRadius:15, 
        width:ancho, 
        height: (alto)-(alto*0.16)
    },
    header:{
        backgroundColor: '#E84546',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item:{
        marginLeft:0,
        marginVertical:alto*0.01,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        borderTopRightRadius:25,
        borderBottomRightRadius:25,
        backgroundColor:'#e9e9e9',
        height: alto*0.05,
        width: ancho*0.95
    },
    botones:{
        justifyContent:'space-around', 
        flexDirection:'row', 
        marginTop: alto*0.03,
        marginLeft: ancho*0.035
    },  
    boton:{
        height: alto*0.07,
        width: ancho*0.3,
        alignContent:'center'
    },
    bot_text:{
        fontSize:25, 
        textAlign:'center', 
        marginLeft:ancho*0.02
    },
    icon:{
        width:60,
        height:60,
        fontSize:60,
        borderRadius:50,
        color:'grey'
    },
    title:{
        color:'black'
    },
    subtitle:{
        color:'red'
    },
    body:{
        marginLeft:10
    }
   });