import React from "react";
import { Linking, Platform,Image, StatusBar, View , StyleSheet, Dimensions, AsyncStorage, TouchableHighlight} from "react-native";
import { Header, Container, Left, Right, Body,Content, Text, List, ListItem, Icon, Title, Subtitle, Button} from "native-base";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";
import {ImageCropPicker} from 'react-native-image-crop-picker'
import Logout from '../Modals/Logout'
import NavigationService from '../../../NavigationService/NavigationService'
import store from '../../redux/store'
import {server, sock} from '../Api'
import {createId,createToken,setLocation} from '../../redux/actions'
import ImagenModal from "../Modals/Imagen";
import NetInfo from '@react-native-community/netinfo'
const routes = [
  {name:"Notificaciones",
  icon: 'notifications'
  },
  {name:"Mis Reservas",
  icon: 'time'
  },
  {name:"Billetera",
  icon:'cash'}
  ,
  {name:"Tarjetas",
  icon:'card'}
  ,
  {name:"Favoritos",
  icon:'star'}
  ,
  { name:"Invitar amigos",
  icon:'people'
  },
  // {name:"Configuraciones",
  // icon:'settings'}, 
  {name:"Acerca",
  icon:'ios-help-circle-outline'
  },
  { name:"Perfil",
  icon:'contact'
  },
  {
    name:'Soporte',
    icon:'help-buoy'
  }
];
export default class SideBar extends React.Component {

  constructor(){
    super()
    this.state={
      mensaje:'',
      mostrarmensaje:false,
      nombre:'',
      telefono:'',
      image:null,
      visible:false
    }
    this.setmensaje=this.setmensaje.bind(this)
    this.logout=this.logout.bind(this)
    this.abrirModal=this.abrirModal.bind(this)
    this.getDatos=this.getDatos.bind(this)
  }

  setImage(){
    
  }

  componentDidMount(){
    this.getDatos()
  }

  getDatos(){
    if(store.getState().conexion==='conectado'){
      fetch(`${server}/cliente/`+store.getState().id_user.toString(), {
        method:'GET',
        headers:{
          Accept: 'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+store.getState().token.toString()
        }
      })
      .then(res=>{
        let data = JSON.parse(res._bodyInit)
        this.setState({
          nombre:data.nombre+' '+data.apellido,
          telefono:data.telefono,
          image:data.imagen?data.imagen:null
        })
      })
      .catch(error=>alert(error))
    }
  }

  replaceUri(imagen){
    let img = imagen
    if(img&&img.url){
        img.uri=sock+img.url
    }
    return img
  }

  renderImagen(){
    if(this.state.image===null){
        return(
            <View style={estilo.icon_view}>
                <Icon style={estilo.icon} name='contact' />
            </View>
        )
    }
    else{
        return(
            <View style={estilo.icon_view}>
                <Image 
                    style={estilo.img} 
                    source={this.replaceUri(Platform.OS==='ios'?{...this.state.image}:this.state.image)} 
                />
            </View>
        )
    }
  }

  salir(){
    if(store.getState().conexion==='conectado'){
      fetch(`${server}/cliente/`, {
        method:'PUT',
        headers:{
          Accept: 'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+store.getState().token.toString()
        },
        body:JSON.stringify({
          _id:store.getState().id_user,
          fcmtoken:''
        })
      })
      .then(res=>{
      })
      .catch(error=>alert(error))
    }
  }

  logout(){
    AsyncStorage.setItem('token','')
    AsyncStorage.setItem('userId','')
    AsyncStorage.removeItem('estado')
    store.dispatch(createToken(''))
    store.dispatch(createId(''))
    store.dispatch(setLocation('Login'))
    this.salir()
    NavigationService.navigate('Login')
  }

  setmensaje(data){
    this.setState({mostrarmensaje:data})
  }

  abrirModal(data){
    this.setState({visible:data})
  }

  render() {
    return (
        <View style={estilo.vista}>
          <Header style={estilo.head}>
          <ImagenModal visible={this.state.visible} abrirModal={this.abrirModal} datos={this.getDatos} img ={this.state.image}/>
          <Logout visible={this.state.mostrarmensaje} setmensaje= {this.setmensaje} logout={this.logout}/>
            <TouchableHighlight disabled={store.getState().conexion==='conectado'?false:true} onPress={()=>this.abrirModal(true)} underlayColor={'transparent'}>
              <View style={estilo.icon_view}>
                {this.renderImagen()}
              </View>
            </TouchableHighlight>  
            <View style={estilo.titulo}>
                <Text numberOfLines={4} style={{width:150, color:'white'}}>
                {this.state.nombre}
                </Text>
              <Subtitle style={{alignSelf:'flex-start'}}>
                {this.state.telefono}
              </Subtitle>
            </View>
            <View style={estilo.cerrar}>
              <Text style={{color:'white', fontSize:30}}>|</Text>
              <Icon 
                name='close'
                style={{color:'white', paddingLeft:5}}
                onPress={()=>this.props.navigation.toggleDrawer()}
              />
            </View>
          </Header>
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem style={estilo.item}>
                  <TouchableHighlight 
                    underlayColor={'transparent'}
                    onPress={() => {
                      if(data.name==='Soporte'){
                        Linking.openURL(`mailto:soporte@appolotaxi.com`)
                      }else if(data.name==='Notificaciones'){
                        this.props.navigation.navigate(data.name)
                      }else{
                        store.dispatch(setLocation(data.name))
                        this.props.navigation.navigate(data.name)
                      }
                    }}>
                    <View
                      style={estilo.menu_item}
                    >
                        <Icon
                          name={data.icon}
                          style={estilo.list_icon}
                        /> 
                        <Button
                          onPress={() => {
                            if(data.name==='Soporte'){
                              Linking.openURL(`mailto:soporte@appolotaxi.com`)
                            }else if(data.name==='Notificaciones'){
                              this.props.navigation.navigate(data.name)
                            }else{
                              store.dispatch(setLocation(data.name))
                              this.props.navigation.navigate(data.name)
                            }
                          }}
                          transparent
                          style={estilo.boton}>
                          <Text style={estilo.texto}>{data.name}</Text>   
                        </Button>
                    </View>
                  </TouchableHighlight>
                </ListItem>
              );
            }}
          />
          <View style={{justifyContent:'center', width:Dimensions.get('window').width*0.8}}>
            <View style={estilo.footer}>
                <Icon
                  name='exit'
                  style={estilo.home}
                  onPress={()=>this.setmensaje(true)}
                />
                <Icon
                  name="home"
                  style={estilo.home}
                  onPress={()=>{
                    this.props.navigation.navigate('Home')
                    store.dispatch(setLocation('Home'))
                  }}
                />
            </View>
          </View>
        </View>
    );
  }
}

const estilo = StyleSheet.create({
  vista:{
    top:0
  },
  head:{
    height: Dimensions.get('window').height*0.2,
    backgroundColor: "#E84546",
    justifyContent:'space-between',
    alignItems:'center'
  },
  item:{
    height: Dimensions.get('window').height*0.07,
    //justifyContent:'flex-start',
    marginLeft:0,
    borderColor:'white'
  },
  footer:{
    width:Dimensions.get('window').width*0.7,
    justifyContent:'space-around', 
    flexDirection:'row',
    marginLeft:Dimensions.get('window').width*0.03
  },
  menu_item:{
    flexDirection:'row',
    backgroundColor:'#cac6c6',
    justifyContent:'flex-start',
    alignItems:'center',
    width:Dimensions.get('window').width*0.77,
    height:Dimensions.get('window').height*0.05,
    borderBottomRightRadius:50,
    borderTopRightRadius:50
  },
  img:{
    width:60,
    height:60,
    borderRadius:Platform.select({ios:30,android:60})
  },  
  icon:{
    fontSize:60,
    color: '#fff'
  },
  icon_view:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  list_icon:{
    color:'#E84546',
    marginLeft:15
  },
  boton:{
    alignSelf:'center'
  },
  texto:{
    color:'#565555'
  },
  home:{
    color:'#E84546',
    fontSize:50
  },
  titulo:{
    alignItems:'flex-end', 
    justifyContent:'center',
    width:150
  },
  cerrar:{
    flexDirection:'row', 
    alignItems:'center'
  }
})