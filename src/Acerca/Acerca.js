import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight, Switch, Image } from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Header, TabHeading} from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'
import Condiciones from "../componentes/Modals/Condiciones.js";
import Politicas from "../componentes/Modals/Politicas.js";
import Devoluciones from "../componentes/Modals/Devoluciones.js";

export default class Acerca extends React.Component {
  constructor(){
    super()
    this.state={
      location:'Favoritos',
      visible:false,
      visi:false,
      devo:false
    }
    this.cerrarTerminos=this.cerrarTerminos.bind(this)
    this.cerrarPoliticas=this.cerrarPoliticas.bind(this)
    this.cerrarDevo=this.cerrarDevo.bind(this)
  }

  cerrarTerminos(data){
      this.setState({visible:false})
  }
  cerrarPoliticas(data){
      this.setState({visi:false})
  }
  cerrarDevo(data){
      this.setState({devo:false})
  }

  render() {
    return (
      <Container>
        <Condiciones visible={this.state.visible} cerrarTerminos={this.cerrarTerminos}/>
        <Politicas visible={this.state.visi} cerrarPoliticas={this.cerrarPoliticas}/>
        <Devoluciones visible={this.state.devo} cerrarDevo={this.cerrarDevo}/>
        <Head name={'Acerca'} navigation={this.props.navigation}/>
        <View style={estilo.content}>
            <Content style={estilo.back}>
                <View style={estilo.content}>
                  <View style={estilo.cont}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        resizeMode='contain'
                        style={{height:100, width:ancho, marginTop:5}}
                    />
                    <Text style={{textAlign:'center', textAlignVertical:'center',color:'grey', fontSize:20}}>
                        Viaje desde cualquier lugar con Appolo Taxi
                    </Text>
                    <Text style={{textAlign:'center'}}>
                    {`Appolo Taxi es la empresa no.1 de taxi en la Republica Dominicana. 
    Ahora con nuestra aplicación conectas con nuestros chóferes para experimentar viajes convenientes y seguros.
    ¡Disfruta tu viaje!`}
                    </Text>
                  </View>
                  <View style={estilo.titulo}>
                        <Text style={estilo.title_text}>Contacto</Text>
                  </View>
                  <View style={{marginLeft:-(alto*0.04),width:ancho*0.9,marginVertical:5}}>
                    <View style={{flexDirection:'row', width:ancho*0.8}}>
                        <Text style={{fontWeight:'bold'}}>Dirección :</Text>
                        <Text numberOfLines={2}>Ave, 27 de Febrero No.462, Mirador Norte Santo Domingo Rep. Dom.</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontWeight:'bold'}}>Teléfono :</Text>
                        <Text>809-537-1245</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontWeight:'bold'}}>Correos :</Text>
                        <View>
                            <Text>miguel.l@apoloenterprises.com</Text>
                            <Text>gregoryg@apolotaxi.com</Text>
                        </View>
                    </View>
                  </View>
                  <View style={estilo.titulo}>
                        <Text style={estilo.title_text}>Redes Sociales</Text>
                  </View>
                  <View style={{marginLeft:-(alto*0.04)}}>
                        <View style={estilo.item}>
                            <View style={estilo.container}>
                                <Icon
                                    name='logo-play-store'
                                />
                                <Text>Calificanos en Play Store</Text>
                                <Icon
                                    name='ios-arrow-forward'
                                />
                            </View>
                        </View>
                    <View style={estilo.item}>
                        <View style={estilo.container}>
                            <Icon
                                name='logo-facebook'
                            />
                            <Text>Me gusta en Facebook</Text>
                            <Icon
                                name='ios-arrow-forward'
                            />
                        </View>
                    </View>
                    <View style={estilo.item}>
                        <View style={estilo.container}>
                            <Icon
                                name='logo-twitter'
                            />
                            <Text>Siguenos en Twitter</Text>
                            <Icon
                                name='ios-arrow-forward'
                            />
                        </View>
                    </View>
                  </View>
                  <View style={estilo.titulo}>
                    <Text style={estilo.title_text}>Legal</Text>
                  </View>
                  <View style={{marginLeft:-(alto*0.04)}}>
                    <TouchableHighlight 
                        underlayColor='transparent' 
                        style={estilo.item}
                        onPress={()=>this.setState({visible:true})}
                    >
                        <View style={estilo.container}>
                            <Icon
                                name='paper'
                            />
                            <Text>Términos y Condiciones</Text>
                            <Icon
                                name='ios-arrow-forward'
                            />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        underlayColor='transparent'
                        style={estilo.item}
                        onPress={()=>this.setState({visi:true})}
                    >
                        <View style={estilo.container}>
                            <Icon
                                name='list'
                            />
                            <Text>Políticas de seguridad</Text>
                            <Icon
                                name='ios-arrow-forward'
                            />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        underlayColor='transparent'
                        style={estilo.item}
                        onPress={()=>this.setState({devo:true})}
                    >
                        <View style={estilo.container}>
                            <Icon
                                name='list'
                            />
                            <Text>Políticas de Devoluciones</Text>
                            <Icon
                                name='ios-arrow-forward'
                            />
                        </View>
                    </TouchableHighlight>
                    <View style={estilo.cards}>
                        <Image
                            source={require('../assets/images/visa.png')}
                            resizeMode='contain'
                            style={{height:35, width:65}}
                        />
                        <Image
                            source={require('../assets/images/mastercard.jpeg')}
                            resizeMode='contain'
                            style={{height:35, width:65}}
                        />
                        <Image
                            source={require('../assets/images/american_express.png')}
                            resizeMode='contain'
                            style={{height:35, width:65}}
                        />
                    </View>
                  </View>
                </View>
            </Content>
        </View>
      </Container>
    );
  }
}

const ancho = Dimensions.get('window').width
const alto = Dimensions.get('window').height

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
        height: 'auto',
        marginBottom:5
    },
    item_text:{
        color:'grey',
        fontSize:20,
        textAlign:'left',
        marginLeft:alto*0.03
    },
    titulo:{
        backgroundColor:'#818181', 
        justifyContent:'center',
        borderBottomLeftRadius:15, 
        borderBottomRightRadius:15, 
        height:alto*0.05, 
        width:ancho
    },
    title_text:{
        fontSize:20,
        color:'white',
        textAlign:'center'
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
        justifyContent:'center',
        borderTopRightRadius:25,
        borderBottomRightRadius:25,
        backgroundColor:'#e9e9e9',
        height: alto*0.05,
        width: ancho*0.95
    },
    cards:{
        height: alto*0.05,
        width: ancho*0.95,
        marginVertical:alto*0.01,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    container:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height: alto*0.05,
        width: ancho*0.8
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