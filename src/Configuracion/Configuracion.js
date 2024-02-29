import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight, Switch } from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Header, TabHeading} from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'

export default class Configuracion extends React.Component {
  constructor(){
    super()
    this.state={
      location:'Favoritos'
    }
  }


  render() {
    return (
      <Container>
        <Head name={'Configuraciones'} navigation={this.props.navigation}/>
        <View style={estilo.content}>
            <Content style={estilo.back}>
                <View style={estilo.content}>
                    <View style={estilo.item}>
                            <Text style={estilo.item_text}>Idioma</Text>
                            <Icon
                                style={{marginRight:(Dimensions.get('window').width*0.04)}}
                                name='ios-arrow-forward'
                            />
                    </View>
                    <View style={estilo.item}>
                            <Text style={estilo.item_text}>Split Fare</Text>
                            <Switch style={{marginRight:(Dimensions.get('window').width*0.04)}}>
                            </Switch>
                    </View>
                    <View style={estilo.item}>
                            <Text style={estilo.item_text}>Omitir lugares favoritos</Text>
                            <Switch style={{marginRight:(Dimensions.get('window').width*0.04)}}>
                            </Switch>
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
        justifyContent:'flex-start',
        marginLeft:-Dimensions.get('window').height*0.015
    },
    item_text:{
        color:'grey',
        fontSize:20,
        textAlign:'left',
        marginLeft:Dimensions.get('window').height*0.03
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
        justifyContent:'space-between',
        borderTopRightRadius:25,
        borderBottomRightRadius:25,
        backgroundColor:'#e9e9e9',
        height: Dimensions.get('window').height*0.07,
        width: Dimensions.get('window').width*0.95
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