import React, { Component } from "react";
import {AsyncStorage, Dimensions, StyleSheet, Text, TextInput, Platform} from 'react-native'
import Login from './src/componentes/Login/LoginCliente'
import store from './src/redux/store'
import {createId,createToken, setLocation, token}  from './src/redux/actions'
import {server} from './src/componentes/Api/index'
import firebase from 'react-native-firebase';
import NavigationService from './NavigationService/NavigationService'
import KeepAwake from 'react-native-keep-awake'
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
export default class AwesomeApp extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      token:'',
      valido:false
    };
  }
  async componentWillMount() {
    this.setState({ isReady: true });
    this.getUserId().then(response => {
      if(response.userId && response.token) {
        store.dispatch(createToken(response.token)) 
        store.dispatch(createId(response.userId))
        store.dispatch(setLocation('Home'))
        this.validar()
      }
      else{
        this.setState({token:'no'})
      }

    })
    
  }
  componentDidMount() {
    KeepAwake.activate()
    firebase.messaging().hasPermission()
    .then(enabled => {
      if (enabled) {
        //alert('el usuario tiene permiso')
        // user has permissions
      } else {
        firebase.messaging().requestPermission()
        .then(() => {
          //alert('ha autorizado exitosamente')
          // User has authorised  
        })
        .catch(error => {
          // User has rejected permissions  
        });
      } 
    });
    if (Platform.OS === 'ios') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
        },
        (error) => {
            // See error code charts below.
          console.log(error)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      }
  }

  getUserId = async () => {
    let data = {
        userId: '',
        token: ''
    };
    try {
      data.userId = await AsyncStorage.getItem('userId') || null;
      data.token = await AsyncStorage.getItem('token') || null;
    } catch (error) {
      // Error retrieving data
      alert(error.message);
    }
    return data;
  }

  validar(){
    fetch(`${server}/cliente/validar`, {
      method:'GET',
      headers: {
        'authorization': 'Bearer '+store.getState().token.toString()
      }
    })
    .then(res=>{
      let data = JSON.parse(res._bodyText)
      if(data.status.toString()==='denied'){
        this.setState({token:'no'})
      }
      else{
        this.setState({token:store.getState().token.toString()})
      }
    })
    .catch(error=>{
      alert(error)
      this.setState({token:'no'})
    })
  }

  
  render() {
    return(
      <Login ref={navigatorRef => {
       NavigationService.setTopLevelNavigator(navigatorRef)}} {...this.props}
        
      />
    )
  }
}


const ancho = Dimensions.get('window').width
const alto = Dimensions.get('window').height

const estilo = StyleSheet.create({
  cargando:{
    fontSize:100,
    width:ancho*0.3,
    height:alto*0.3
  },
  vista:{
    width:ancho,
    height:alto,
    alignItems:'center',
    justifyContent:'center'
  }
})