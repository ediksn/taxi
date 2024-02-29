import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight } from "react-native";
import { List,Container, Spinner,Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Header, TabHeading } from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import {withNavigationFocus} from 'react-navigation'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {server} from '../componentes/Api'
import {BackHandler, ToastAndroid} from 'react-native'
import { ScrollView } from "react-native-gesture-handler";
import moment from 'moment'
import 'moment/locale/es'
class Favoritos extends React.Component {
  constructor(){
    super()
    this.state={
      location:'Favoritos',
      reservas:[],
      visible:true
    }
  }

    componentDidMount() {
        this.getReservas()
    }

  componentDidUpdate(prevProps){
    if(this.props.isFocused!==prevProps.isFocused){
        this.getReservas()
    }
  }   

  setFav(data,fav){
    if(store.getState().conexion==='conectado'){
        fetch(`${server}/reserva/fav`,{
            method:'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body:JSON.stringify({
                _id:data,
                fav:!fav
            })
        })
        .then(res=>{
            this.getReservas()
        })
        .catch(error=>alert(error))
    }
  }

  getReservas(){
    if(store.getState().conexion==='conectado'){
        this.setState({visible:true})
        fetch(`${server}/reserva/client`,{
            method:'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            }
        })
        .then(res=>{
            let reservas = JSON.parse(res._bodyInit)
            let fav=[]
            for(let i=0;i<reservas.length;i++){
                if(reservas[i].fav){
                    fav.push(reservas[i])
                }
            }
            fav.length>0?this.setState({reservas:fav}):this.setState({reservas:[]})
            this.setState({
                visible:false
            })
        })
        .catch(error=>{
            alert(error)
        })
    }
  }

  render() {
    if(this.state.visible){
        return(
            <Container>
                <Head name={'Favoritos'} navigation={this.props.navigation}/>
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Spinner color={'red'}/>
                </View>
            </Container>
        )
    }
    else{
        return (
          <Container>
            <Head name={'Favoritos'} navigation={this.props.navigation}/>
            <View style={estilo.content}>
                <Content style={{backgroundColor:'#e9e9e9', borderRadius:10, width:ancho}}>
                    <ScrollView>
                        <List
                        dataArray={this.state.reservas}
                        renderRow={data=>{
                                return(
                                    <Card transparent>
                                        <CardItem style={estilo.item}>
                                            <Icon
                                                style={estilo.icon}
                                                name='contact'
                                            />
                                            <Body style={estilo.body}>
                                                <Title style={estilo.title}>{moment(data.fecha).format('DD MM YYYY')}</Title>
                                                <Subtitle style={estilo.subtitle}>{data.driver&&data.driver!==null&&data.driver.vehiculo!==null?data.driver.vehiculo.tipo:''}</Subtitle>
                                            </Body>
                                            <View style={{flexDirection:'row', justifyContent:'space-evenly', width:ancho*0.4}}>
                                                <View style={{alignItems:'center'}}>
                                                    <Title style={{color:'gray'}}>RD$ <Text style={{color:'red'}}>{data.costo.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text></Title>
                                                    <Subtitle style={{color:'gray'}}>{data.estatus}</Subtitle>
                                                </View>
                                                <View style={{alignItems:'center', justifyContent:'center'}}>
                                                    <Icon
                                                        style={{fontSize: 35, color: '#676767'}}
                                                        name={data.fav?'star':'star-outline'}
                                                        onPress={()=>this.setFav(data._id, data.fav)}
                                                    />
                                                </View>
                                            </View>
                                        </CardItem>
                                    </Card>
                                )
                        }}
                    />
                    </ScrollView>
                </Content>
            </View>
          </Container>
        );
    }
  }
}

export default withNavigationFocus(Favoritos)

const alto=Dimensions.get('window').height
const ancho =Dimensions.get('window').width

const estilo = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        marginBottom:0,
        marginHorizontal: 0,
        marginVertical: 0
    },
    base:{
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 0
    },
    tab_cont:{
        backgroundColor:'white', 
        height:alto*0.06},
    tab:{
        backgroundColor:'#818181',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        height:alto*0.06
    },
    active_tab:{
        backgroundColor:'#E84546',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        height:alto*0.06
    },
    tab_text:{
        color:'white',
        fontSize:15
    },
    map: {
        position:'absolute',
        width: ancho,
        height:alto,
        flex:1
    },
    header:{
        backgroundColor: '#E84546',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item:{
        borderWidth:1,
        borderColor:'red',
        backgroundColor:'#d6d6d6',
        borderRadius:20,
        marginVertical:0
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
        marginLeft:10,
        justifyContent:'center',
    }
   });