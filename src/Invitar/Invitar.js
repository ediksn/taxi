import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight, Switch, Linking } from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Header, TabHeading} from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'

export default class Invitar extends React.Component {
  constructor(){
    super()
    this.state={
      location:'Favoritos'
    }
  }
  

  render() {
    return (
      <Container>
        <Head name={'Invitar amigos'} navigation={this.props.navigation}/>
        <View style={estilo.content}>
            <Content style={estilo.back}>
                <View style={estilo.content}>
                  <View style={estilo.cont}>
                    <View style={estilo.money}>
                        <Text style={{textAlign:'center', fontSize:25}}>RD$<Text style={{fontSize:25, color:'red'}}>0.00</Text></Text>
                    </View>
                    <View style={{justifyContent:'center', alignContent:'center'}}>
                        <Icon
                            name='contact'
                            style={estilo.user}
                        />
                        <View style={estilo.codigo}>
                            <Text style={{color:'white', fontSize:25, textAlign:'center'}}>734957</Text>
                        </View>
                    </View>
                    <Text>
                        Cuando un amigo viaja con su codigo, usted gana
                    </Text>
                  </View>
                  <View style={estilo.titulo}>
                        <Text style={estilo.title_text}>Compartir a traves de</Text>
                  </View>
                  <View style={{marginLeft:-(Dimensions.get('window').height*0.04)}}>
                    <View style={estilo.item}>
                        <TouchableHighlight
                            underlayColor={'transparent'}
                            onPress={()=>{
                                Linking.openURL('facebook://')
                            }}
                        >
                            <View style={estilo.container}>
                                <Icon
                                    name='logo-facebook'
                                />
                                <Text>Facebook</Text>
                                <Icon
                                    name='ios-arrow-forward'
                                />
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={estilo.item}>
                        <TouchableHighlight 
                            underlayColor={'transparent'}
                            onPress={()=>{
                                Linking.openURL('twitter://post?message=Registrate%20en%20Appolo%20usando%20mi%20codigo')
                            }}
                        >
                            <View style={estilo.container}>
                                <Icon
                                    name='logo-twitter'
                                />
                                <Text>Twitter</Text>
                                <Icon
                                    name='ios-arrow-forward'
                                />
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={estilo.item}>
                        <TouchableHighlight
                            underlayColor={'transparent'}
                            onPress={()=>{
                                Linking.openURL(`mailto:?addres=null&subject=Probando&body=Probando`)
                            }}
                        >
                            <View style={estilo.container}>
                                <Icon
                                    name='mail'
                                />
                                <Text>Correo electronico</Text>
                                <Icon
                                    name='ios-arrow-forward'
                                />
                            </View>
                        </TouchableHighlight> 
                    </View>
                    <View style={estilo.item}>
                        <TouchableHighlight
                            underlayColor={'transparent'}
                            onPress={()=>{
                                let text = 'Probando este mensaje'
                                Linking.openURL(`whatsapp://send?text=${text}`)
                            }}
                        >
                            <View style={estilo.container}>
                                <Icon
                                    name='logo-whatsapp'
                                />
                                <Text>WhatsApp</Text>
                                <Icon
                                    name='ios-arrow-forward'
                                />
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={estilo.item}>
                        <TouchableHighlight
                            underlayColor={'transparent'}
                            onPress={()=>{
                                Linking.openURL(`sms:?addresses=null&body=Probando`)
                            }}
                        >
                            <View style={estilo.container}>
                                <Icon
                                    name='chatbubbles'
                                />
                                <Text>SMS</Text>
                                <Icon
                                    name='ios-arrow-forward'
                                />
                            </View>
                        </TouchableHighlight>
                    </View>
                  </View>
                </View>
            </Content>
        </View>
      </Container>
    );
  }
}

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
        width:Dimensions.get('window').width*0.90,
        height: Dimensions.get('window').height*0.37
    },
    item_text:{
        color:'grey',
        fontSize:20,
        textAlign:'left',
        marginLeft:Dimensions.get('window').height*0.03
    },
    titulo:{
        backgroundColor:'#818181', 
        justifyContent:'center',
        borderBottomLeftRadius:15, 
        borderBottomRightRadius:15, 
        height:Dimensions.get('window').height*0.05, 
        width:Dimensions.get('window').width
    },
    user:{
        alignSelf:'center',
        justifyContent:'center',
        fontSize:Dimensions.get('window').height*0.25,
        height:Dimensions.get('window').height*0.2,
        width: Dimensions.get('window').width*0.4, 
        backgroundColor:'#e9e9e9'
    },
    codigo:{
        width:Dimensions.get('window').width*0.4, 
        backgroundColor:'red', 
        height:Dimensions.get('window').height*0.05
    }, 
    money:{
        marginTop:-Dimensions.get('window').height*0.01, 
        alignItems:'center',
        justifyContent:'flex-start',
        width:Dimensions.get('window').width, 
        backgroundColor:'#e9e9e9', 
        height:Dimensions.get('window').height*0.05
    },
    title_text:{
        fontSize:20,
        color:'white',
        textAlign:'center'
    },  
    back: {
        backgroundColor:'white', 
        borderRadius:15, 
        width:Dimensions.get('window').width, 
        height: (Dimensions.get('window').height)-(Dimensions.get('window').height*0.16)
    },
    header:{
        backgroundColor: '#E84546',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item:{
        marginLeft:0,
        marginVertical:Dimensions.get('window').height*0.01,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderTopRightRadius:25,
        borderBottomRightRadius:25,
        backgroundColor:'#e9e9e9',
        height: Dimensions.get('window').height*0.05,
        width: Dimensions.get('window').width*0.95
    },
    container:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height: Dimensions.get('window').height*0.05,
        width: Dimensions.get('window').width*0.8
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