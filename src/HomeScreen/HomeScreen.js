import React, {Component, Fragment} from "react";
import { Keyboard,StatusBar,AppState,Modal ,Image,StyleSheet, AsyncStorage,Dimensions, TouchableHighlight, PermissionsAndroid,Easing, Animated, Platform} from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body,Content,Text, Card, CardItem, View, Input, Item, Header, InputGroup } from "native-base";
import MapView, {PROVIDER_GOOGLE, Marker,AnimatedRegion ,MarkerAnimated, Callout} from 'react-native-maps'
import {withNavigationFocus} from 'react-navigation'
import NavigationService from '../../NavigationService/NavigationService'
import firebase from 'react-native-firebase'
import config from '../config'
import Head from '../componentes/Header/Header.js'
import Base from '../componentes/Base/Base'
import BaseC from '../componentes/Base/BaseChofer'
import Confirmacion from '../componentes/Base/Confirmacion'
import Sound from 'react-native-sound'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { estado, createEstado, setLocation, createToken, createId } from "../redux/actions";
import Directions from "../componentes/Directions"
import { getPixelSize } from "../utils";
import taxiImage from '../../src/assets/images/taxi2.png'
import Geocoder from 'react-native-geocoding'
import io from 'socket.io-client'
import {server, sock} from '../componentes/Api'
import Conductor from '../componentes/Base/Conductor'
import Buscando from '../componentes/Modals/Buscando'
import Iniciar from '../componentes/Base/Iniciar'
import Viaje from '../componentes/Base/Viaje'
import Valorar from '../componentes/Modals/Valorar'
import Cancelar from '../componentes/Modals/Cancelacion'
import Promo from '../componentes/Modals/Promo'
import Pago from '../componentes/Modals/Pago'
import Booking from '../componentes/Modals/Booking'
import BookConfirm from '../componentes/Modals/BookConfirm'
import CancelConfirm from '../componentes/Modals/CancelConfirm'
import Extras from '../componentes/Modals/Extras'
import Tipo from '../componentes/Base/TipoPago'
import PagoConfirm from '../componentes/Modals/PagoConfirm'
import Pagar from '../componentes/Base/Pagar'
import Detalles from '../componentes/Modals/Detalles'
import Mensaje from "../componentes/Modals/Mensajes.js";
import Cargando from "../componentes/Modals/Cargando"
import NetInfo from '@react-native-community/netinfo'
import { ScrollView } from "react-native-gesture-handler";
Geocoder.init('AIzaSyCeheP7N3nMtkIeE2P56lW1umQM1fyHCwE')

class HomeScreen extends React.Component {
  //Inicializacion de estados 
  constructor(){
    super()
    this.state={
      loading: false,
      confirm: false,
      contador: 0,
      detalle:false,
      estatus:'',
      address: 'Punto de partida',
      segunda_vez: false,
      destino:[],
      direccion:'',
      lugar:'¿A donde quieres ir?',
      valorar:false,
      distancia:null,
      tiempo:null,
      costo:null,
      viaje:'',
      confirmar:false,
      cancel_conf:false,
      location: 'Home',
      locationResult:null,
      locationResult2:null,
      visible:false,
      cancelar: false,
      promo:false,
      pago:false,
      viajando:false,
      bloqueado:false,
      vehiculo:'Taxi',
      book:false,
      mbook:false,
      extra:false,
      nopago:false,
      time:null,
      booking:null,
      razon:'',
      ext:[],
      ruta:[],
      trans_id:'',
      tipo:'',
      pay :'',
      mensajes:'',
      inicio:false,
      viaje:null,
      punto:[],
      chofer: null,
      reserva: null,
      choferes:[],
      cant:0,
      ida_vuelta:false,
      conexion:'',
      appState:AppState.currentState,
      destinos:[],
      llegadas:[],
      fijar:false,
      point:false,
      selecDestino:false,
      stop:false,
      pagado:'Pendiente',
      timeId:'',
      timeChof: ''
    }
    if(this.hasLocationPermission() || Platform.OS === 'ios'){
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            locationResult:{
              latitude: position.coords.latitude,
              longitude:position.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,                  
            },
            locationResult2:{ 
              latitude: position.coords.latitude,
              longitude:position.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,                  
            }
          })
          
        }
      )
    }
    this._nodes = new Map()
    this.marcador = this.marcador.bind(this)
    this.cambiarEstado = this.cambiarEstado.bind(this)
    this.crearViaje = this.crearViaje.bind(this)
    this.cambiarPunto = this.cambiarPunto.bind(this)
    this.mostrarModal = this.mostrarModal.bind(this)
    this.cancelar = this.cancelar.bind(this)
    this.cerrarViaje = this.cerrarViaje.bind(this)
    this.pago = this.pago.bind(this)
    this.promo = this.promo.bind(this)
    this.setVehiculo = this.setVehiculo.bind(this)
    this.setBooking = this.setBooking.bind(this)
    this.valorarViaje = this.valorarViaje.bind(this)
    this.cancelarViaje = this.cancelarViaje.bind(this)
    this.confirmCancelar = this.confirmCancelar.bind(this)
    this.cerrarExtras = this.cerrarExtras.bind(this)
    this.addExt = this.addExt.bind(this)
    this.addTipo = this.addTipo.bind(this)
    this.cerrarModal = this.cerrarModal.bind(this)
    this.addPay = this.addPay.bind(this)
    this.setTransId = this.setTransId.bind(this)
    this.setmensaje = this.setmensaje.bind(this)
    this.verDetalles = this.verDetalles.bind(this)
    this.terminar=this.terminar.bind(this)
    this.setIdaVuelta=this.setIdaVuelta.bind(this)
    this.actTipo=this.actTipo.bind(this)
    this.getLocation()
  } 

  async hasLocationPermission() {
      try{
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
            title: 'Permiso para usar GPS',
            message:'Apolo Taxi requiere que autorices'+
            'el uso del GPS del dispositivo',
            buttonNegative:'Cancel',
            buttonPositive:'OK'
          }
        )
        if(granted===PermissionsAndroid.RESULTS.GRANTED){
          return true
        }
        else{
          return false
        }   
      }
      catch(error){
        return false
      }
  }
  getUserId = async () => {
    let data = {
        userId: '',
        token: ''
    };
    try {
      data.userId = await AsyncStorage.getItem('userId');
      data.token = await AsyncStorage.getItem('token');
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
    return data;
  }

  componentDidMount() {
    if(Platform.OS === 'ios' && this.mapView && this.state.locationResult){
      this.centrar()
    }
    let sound = new Sound('sound.mp3', Sound.MAIN_BUNDLE, error=>{
      if(error)alert(error.message)
    })
    if(Platform.OS === 'ios'){
      sound.setVolume(1.0)
    }
    AppState.addEventListener('change',this._handleAppStateChange)
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
    NetInfo.isConnected.fetch().done(isConnected=>{
      if(isConnected===true){
        this.setState({conexion:'conectado',confirm:false})
        this.getDefault()
        this.getUltimosViajes()
        this.getLocation()
        this.getLocation2()
      }
      else{
        this.setState({conexion:'desconectado',confirm:true})
      }
    })
    BackHandler.addEventListener('hardwareBackPress',this.handleBackPress)
    this.setState({contador: 0})
    this.getfcmToken()
    this.getState()
    firebase.notifications().onNotification(notification => {
      sound.play()
    })
    firebase.notifications().onNotificationOpened(notificationOpen => {
      if(notificationOpen._data.tipo){
        let tipo = notificationOpen._data.tipo
        let data
        let ref
        if(notificationOpen._data.data){
          data = JSON.parse(notificationOpen._data.data)
        }
        switch(tipo){
          case 'llega':
            if(this.state.estatus!=='Iniciado'){
              this.setState({estatus: 'Iniciado', mensaje:'Su chofer ha llegado al punto de encuentro'})
              this.setmensaje(true)
              if(this.mapView){
                this.mapView.fitToCoordinates(this.state.ruta, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(100),
                    bottom: getPixelSize(300)
                  }
                });
              }
            }
            break
          case 'aceptar':
            ref = firebase.database().ref('/reserva')
            ref.child(data).on('value',
              snapshot=>{
                if(snapsho.val()){
                  if(snapshot.val().estatus==='Aceptada'&&this.state.estatus!=='Aceptado'){
                    let datos = snapshot.val()
                    let chof = datos.driver
                    chof.vehiculo=datos.driver.vehiculo
                    this.setState({
                      estatus: 'Aceptado', 
                      visible: false, 
                      chofer: chof, 
                      reserva: datos,
                      costo:datos.costo,
                      tiempo:datos.tiempo,
                      distancia: datos.distancia
                    })
                    if(Platform.OS==='ios'){
                      this.setState({
                        chofCoords:new AnimatedRegion({
                          latitude:chof.map.lat,
                          longitude:chof.map.lng,
                          latitudeDelta:0.01,
                          longitudeDelta:0.01
                        })
                      })
                    }
                    if(this.mapView){
                      this.mapView.animateToRegion({
                        latitude:chof.map.lat,
                        longitude:chof.map.lng,
                        latitudeDelta:0.01,
                        longitudeDelta:0.01
                      })
                    }
                    this.getLocation2()
                  }
                }
              })
            break
          case 'iniciado':
            if(this.state.estatus!=='Comenzado'){
              this.setState({
                mensaje:'Ha comenzado el viaje',
                estatus:'Comenzado'
              })
              this.setmensaje(true)
              if(this.mapView){
                //comen1 this.mapView.animateToCoordinate({latitude:this.state.chofer.map.lat,longitude:this.state.chofer.map.lng})
              }
            }
            break
          case 'terminado':
            ref = firebase.database().ref('/reserva')
            ref.child(data).on('value',
              snapshot=>{
                if(snapshot.val()){
                  if(snapshot.val().estatus==='Terminado'&&this.state.reserva.estatus!=='Terminado'&&this.state.estatus!=='buscar'){
                    this.setState({detalle:true, reserva:data})
                  }
                }
              })
            break
          case 'no':
            if(this.state.estatus==='buscar'){
              this.cancelarViaje('la reserva, no hay choferes disponibles')
              this.position(this.state.locationResult)
            }
            break
          case 'cancelado':
            if(this.state.chofer){
              this.cancelarViaje('el viaje por el chofer')
              this.position(this.state.locationResult)
            }
            break
          case 'dev':
            this.setState({
              mensaje:data,
              inicio:true
            })
            this.props.navigation.navigate('Notificaciones')
            break
        }
      }
      else{
        this.props.navigation.navigate('Notificaciones')
      }
      
    });
    //Conexion al socket,escucha de mensajes
    const connectionConfig = {
      jsonp: false,
      reconnection: true,
      reconnectionDelay: 100,
      reconnectionAttempts: 100000,
      transports: ['websocket'], // you need to explicitly tell it to use websockets
    };
    
    this.socket = io(sock, connectionConfig);
    
    this.socket.on('connect', data => {
      //alert('se ejecuta connect')
      this.getUserId().then(response => {
        //alert(JSON.stringify(response))
        if(response.userId && response.token) {
           this.socket.emit('cliente', response.userId) 
           //this.setState({userId: response.userId})      
        }
      }) 
    });
    this.socket.on('act_pos_chofer', data =>{
      //alert(data.map)
    //alert(JSON.stringify(data[0]._id))
      //alert(JSON.stringify(this.state.choferes))
      if(this.state.choferes){
        let chof = this.state.choferes
        for (let i = 0; i < this.state.choferes.length; i++) {
          if(chof[i]._id == data[0]._id){
            //     this.state.
            chof[i].map = data[0].map
            if(data[0].orientacion){
              chof[i].orientacion = data[0].orientacion
            }
            
          }
          this.setState({choferes:chof})
          //alert(JSON.stringify(this.state.choferes[i]))
        }
      }
      
      // array.forEach(element => {
      //   if(element._id == data[0]._id){
      //     this.state.
      //   }
      // });
      //data.map
    })
    // this.positionchofer()
    this.socket.on('acept', data => {
      let chof = data.chofer
      chof.vehiculo=data.veh
      this.setState({
        estatus: 'Aceptado', 
        visible: false, 
        chofer: chof, 
        reserva: data.reserva,
        costo:data.costo,
        tiempo:data.tiempo,
        distancia: data.distancia
      })
      if(Platform.OS==='ios'){
        this.setState({
          chofCoords:new AnimatedRegion({
            latitude:chof.map.lat,
            longitude:chof.map.lng,
            latitudeDelta:0.01,
            longitudeDelta:0.01
          })
        })
      }
      if(chof&&chof.map&&chof.map.lat&&this.mapView){
        this.mapView.animateToRegion({
          latitude:chof.map.lat,
          longitude:chof.map.lng,
          latitudeDelta:0.01,
          longitudeDelta:0.01
        })
      }
      this.getLocation2()
    })
    this.socket.on('llega', data=>{
      this.setState({estatus: 'Iniciado', mensaje:'Su chofer ha llegado al punto de encuentro'})
      this.setmensaje(true)
      if(this.mapView){
        this.mapView.fitToCoordinates(this.state.ruta, {
          edgePadding: {
            right: getPixelSize(50),
            left: getPixelSize(50),
            top: getPixelSize(100),
            bottom: getPixelSize(300)
          }
        });
      }
    })
    this.socket.on('init', data=>{
      this.setState({
        mensaje:'Ha comenzado el viaje',
        estatus:'Comenzado'
      })
      this.setmensaje(true)
      if(this.mapView){
        //comen1 this.mapView.animateToCoordinate({latitude:this.state.chofer.map.lat,longitude:this.state.chofer.map.lng})
      }
    })
    this.socket.on('finish', data=>{
      this.setState({
        reserva:data,
        detalle:true
      })
    })
    this.socket.on('cancel', data=>{
      if(this.state.chofer){
        this.cancelarViaje('el viaje por el chofer')
        this.position(this.state.locationResult)
      }
    })
    this.socket.on('negado', data=>{
      this.cancelarViaje('la reserva, no hay choferes disponibles')
      this.position(this.state.locationResult)
    })
    this.socket.on('pagado', data=>{
      this.setState({pagado:data.estatus})
    })
    this.socket.on('dev',data=>{
      if(data.cliente.toString() === store.getState().id_user.toString()){
        this.setState({mensaje:data.nota, inicio:true})
      }
    })
    this.socket.on('location', data=>{
      if(this.state.chofer){
        let coords={
          latitude:data.coordenadas.lat,
          longitude:data.coordenadas.lng
        }
        this.setState(prevState=>({
          chofer:{
            ...prevState.chofer,
            orientacion: new Animated.Value(
              typeof(prevState.chofer.orientacion) === 'object' ? 
              JSON.stringify(prevState.chofer.orientacion) :
              prevState.chofer.orientacion)
            },
            chofCoords:new AnimatedRegion({
              latitude:prevState.chofer.map.lat,
              longitude:prevState.chofer.map.lng,
              latitudeDelta:0.01,
              longitudeDelta:0.01
            })
          }))
        Animated.spring(this.state.chofer.orientacion,{
          toValue:data.orientacion,
          easing:Easing.linear,
          duration:1000
        }).start()
        if(this.chofer){
          if(Platform.OS==='android'){
            this.chofer._component.animateMarkerToCoordinate(coords,1000)
          }else{
            this.state.chofCoords.timing(coords).start()
          }
        }
        if(this.mapView){
          // alert(JSON.stringify(coords))
          this.mapView.animateToCoordinate(coords,1000)
        }
        this.setState(prevState=>({
          chofer:{
            ...prevState.chofer,
            orientacion: new Animated.Value(data.orientacion),
            map:{
              lat:data.coordenadas.lat,
              lng:data.coordenadas.lng
            }
          }
        }))
      }
    })
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress)
    AppState.removeEventListener('change',this._handleAppStateChange)
  }

  _handleAppStateChange=nextState=>{
    if(this.state.appState.match(/inactive|background/)&&nextState==='active'){
      this.getLocation2()
      const ref = firebase.database().ref('/reserva')
      if(this.state.reserva){
        ref.child(this.state.reserva._id).on('value',
          snapshot=>{
            if(snapshot.val()){
              if(snapshot.val().estatus==='Aceptada'&&this.state.estatus!=='Aceptado'&&this.state.estatus==='buscar'){
                let data = snapshot.val()
                let chof = data.driver
                chof.vehiculo=data.driver.vehiculo
                this.setState({
                  estatus: 'Aceptado', 
                  visible: false, 
                  chofer: chof, 
                  reserva: data,
                  costo:data.costo,
                  tiempo:data.tiempo,
                  distancia: data.distancia
                })
                if(this.mapView){
                  this.mapView.animateToRegion({
                    latitude:chof.map.lat,
                    longitude:chof.map.lng,
                    latitudeDelta:0.01,
                    longitudeDelta:0.01
                  })
                }
                if(Platform.OS==='ios'){
                  this.setState({
                    chofCoords:new AnimatedRegion({
                      latitude:chof.map.lat,
                      longitude:chof.map.lng,
                      latitudeDelta:0.01,
                      longitudeDelta:0.01
                    })
                  })
                }
                this.getLocation2()
              }
              else if(snapshot.val().estatus==='Llegado'&&this.state.estatus!=='Iniciado'){
                this.setState({estatus:'Iniciado', mensaje:'Su chofer ha llegado al punto de encuentro'})
                this.setmensaje(true)
                this.mapView.fitToCoordinates(this.state.ruta, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(100),
                    bottom: getPixelSize(300)
                  }
                });
              }
              else if(snapshot.val().estatus==='Iniciado'&&this.state.estatus!==''&&this.state.estatus!=='Comenzado'){
                this.setState({
                  mensaje:'Ha comenzado el viaje',
                  estatus:'Comenzado'
                })
                this.setmensaje(true)
                if(this.mapView){
                  this.mapView.animateToCoordinate({latitude:this.state.chofer.map.lat,longitude:this.state.chofer.map.lng})
                }
              }
              else if(snapshot.val().estatus==='Terminado'&&this.state.reserva.estatus!=='Terminado'&&this.state.estatus!==''){
                this.setState({
                  reserva:snapshot.val(),
                  detalle:true
                })
              }
              else if(snapshot.val().estatus==='Cancelada'&&this.state.chofer){
                this.cancelarViaje('el viaje por el chofer')
                this.position(this.state.locationResult)
              }
              else if(snapshot.val().estatus==='No Antendida'&&this.state.estatus==='buscar'){
                this.cancelarViaje('la reserva, no hay choferes disponibles')
                this.position(this.state.locationResult)
              }
            }
          },
          error=>alert(error)
        )
      }
    }
    this.setState({appState:nextState})
  }

  _handleConnectivityChange=isConnected=>{
    if(isConnected===true){
      this.setState({conexion:'conectado', confirm:false})
    }
    else{
        this.setState({
          conexion:'desconectado', 
          mensaje:'Su dispositivo no tiene una conexion a internet',
          inicio:true,
          confirm:true
        })
    }
  }

  handleBackPress = () => {
    if(store.getState().location==='Home'){
      BackHandler.exitApp()
      return true
    }
  }

  actfcmtoken(tok) {
    if(this.state.conexion==='conectado'){
      fetch(server + '/cliente/',{
        method:'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+store.getState().token.toString()
        },
        body: JSON.stringify({
          _id: store.getState().id_user,
          fcmtoken:tok
        })
      })
      .then((response)=>{
      })
      .catch(error=>{
        alert(error)
      })
    }
  }
  getfcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
          this.actfcmtoken(fcmToken)
      }
  }

  getState=async()=>{
    let data 
    try {
      data = await AsyncStorage.getItem('estado')||''
      this.setState(JSON.parse(data))
      this.setState({contador: 0, address: 'Punto de partida'})
    } catch (error) {
      data = error
    }
    return data
  }

  setmensaje(data){
    this.setState({
      inicio:data
    })
  }

  componentDidUpdate(prevProps,prevState){
    if(this.props.isFocused===true&&prevProps.isFocused!==this.props.isFocused){
      store.dispatch(setLocation('Home'))
      this.getDefault()
    }
    // if(this.state.viajando!==prevState.viajando){
    //   alert(this.state.viajando+'---'+prevState.viajando)    
    // }
    // alert(JSON.stringify(data))
    AsyncStorage.setItem('estado',JSON.stringify(this.state))
  }

  shouldComponentUpdate(nextProps,nextState){
    if(this.state.chofer!==nextState.chofer && nextState.chofer && nextState.chofer.orientacion){
      return false
      // let coordinates={
      //   latitude:nextState.chofer.map.lat,
      //   longitude:nextState.chofer.map.lng,
      // }
      // if(this.chofer){
      //   if (Platform.OS === 'android') {
      //     this.chofer._component.animateMarkerToCoordinate(coordinates,1000)
      //   }else{
      //     this.state.chofCoords.timing(coordinates).start()
      //   }
      }
      // return false
    // }
    return true
  }

  cancelar() {
    this.setState({
      punto: [],
      destino:[], 
      confirm: false,
      chofer: null, 
      reserva: null, 
      viaje: null, 
      estatus: '', 
      visible:false,
      cancelar:false,
      vehiculo:'Taxi',
      ext: [],
      ida_vuelta:false,
      costo:'',
      viajando:false,
      address:'Punto de partida',
      lugar:'¿A donde quieres ir?',
      direccion:'',
      segunda_vez:false,
      selecDestino:false,
      point:false,
      fijar:false
    })
  }

  terminar(){
    this.setState({
      detalle:false,
      punto: [],
      destino:[], 
      chofer: null,
      viaje: null, 
      estatus: '', 
      visible:false,
      cancelar:false,
      ida_vuelta:false,
      vehiculo:'Taxi',
      viajando:false,
      confirm:false,
      ext: [],
      costo:'',
      mensaje:'El viaje ha finalizado',
      address:'Punto de partida',
      lugar:'¿A donde quieres ir?',
      direccion:'',
      selecDestino:false,
      point:false,
      fijar:false,
      segunda_vez:false,
      pagado:'Pendiente',
    })
    if(Platform.OS==='android'){
      this.setState({valorar:true})
      this.getLocation()
    }else{
      setTimeout(
        ()=>{this.setState({valorar:true})},
        1000
      )
      this.getChoferes(this.state.locationResult)
    }
  }

  //Asignacion de estados

  getDefault(){
    if(this.state.conexion==='conectado'){
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
          firebase.database().goOnline
          const cli = firebase.database().ref('cliente/'+store.getState().id_user)
          cli.on('child_changed',data=>{
            if(data.val()&&data.val()!==store.getState().token){
              this.setState({mensaje:'Ha iniciado sesion desde otro dispositivo', inicio:true})
            }
          })
          cli.on("value",clien=>{
            cli.on('child_removed',snapshot=>{
              // alert(snapshot.val())
              // alert(clien.val().token+'-----'+snapshot.val())
              if(clien.val().token===snapshot.val()){
                this.setState({mensaje:'Su usuario ha sido eliminado', inicio:true})
              }
            })
          })
          const ref = firebase.database().ref('/reserva')
          if(this.state.reserva){
            ref.child(this.state.reserva._id).on('value',
              snapshot=>{
                if(snapshot.val()){
                  if(snapshot.val().estatus==='Aceptada'&&this.state.estatus!=='Aceptado'){
                    let data = snapshot.val()
                    let chof = data.driver
                    chof.vehiculo=data.driver.vehiculo
                    this.setState({
                      estatus: 'Aceptado', 
                      visible: false, 
                      chofer: chof, 
                      reserva: data,
                      costo:data.costo,
                      tiempo:data.tiempo,
                      distancia: data.distancia
                    })
                    if(this.mapView){
                      this.mapView.animateToRegion({
                        latitude:chof.map.lat,
                        longitude:chof.map.lng,
                        latitudeDelta:0.01,
                        longitudeDelta:0.01
                      })
                    }
                    if(Platform.OS==='ios'){
                      this.setState({
                        chofCoords:new AnimatedRegion({
                          latitude:chof.map.lat,
                          longitude:chof.map.lng,
                          latitudeDelta:0.01,
                          longitudeDelta:0.01
                        })
                      })
                    }
                    this.getLocation2()
                  }
                  else if(snapshot.val().estatus==='Llegado'&&this.state.estatus!=='Iniciado'){
                    this.setState({estatus:'Iniciado', mensaje:'Su chofer ha llegado al punto de encuentro'})
                    this.setmensaje(true)
                    if(this.mapView){
                      this.mapView.fitToCoordinates(this.state.ruta, {
                        edgePadding: {
                          right: getPixelSize(50),
                          left: getPixelSize(50),
                          top: getPixelSize(100),
                          bottom: getPixelSize(300)
                        }
                      });
                    }
                  }
                  else if(snapshot.val().estatus==='Iniciado'&&this.state.estatus!==''&&this.state.estatus!=='Comenzado'){
                    this.setState({
                      mensaje:'Ha comenzado el viaje',
                      estatus:'Comenzado'
                    })
                    this.setmensaje(true)
                    if(this.mapView){
                      this.mapView.animateToCoordinate({latitude:this.state.chofer.map.lat,longitude:this.state.chofer.map.lng})
                    }
                  }
                  else if(snapshot.val().estatus==='Terminado'&&this.state.reserva.estatus!=='Terminado'&&this.state.estatus!==''){
                    this.setState({
                      reserva:snapshot.val(),
                      detalle:true
                    })
                  }
                  else if(snapshot.val().estatus==='Cancelada'&&this.state.chofer){
                    this.cancelarViaje('el viaje por el chofer')
                    this.position(this.state.locationResult)
                  }
                  else if(snapshot.val().estatus==='No Antendida'&&this.state.estatus==='buscar'){
                    this.cancelarViaje('la reserva, no hay choferes disponibles')
                    this.position(this.state.locationResult)
                  }
                  if(this.state.reserva&&snapshot.val().tipo!==this.state.reserva.tipo&&snapshot.val().estatus==='Terminado'){
                    this.setState({reserva:snapshot.val()})
                  }
                }
              },
              error=>alert(error)
            )
          }
          data.estatus==='Bloqueado'?this.setState({bloqueado:true,viajando:true}):this.setState({bloqueado:false, viajando:false})
          if(data.bloqueado>0){
            this.setState({
              mensaje:'Usted tiene una deuda pendiente. Dirigase hacia su billetera',
              inicio:true,
              bloqueado:true,
              confirm:true,
              segunda_vez:false
            })
          }
          else{
            this.setState({
              bloqueado:false,
              confirm:false,
              segunda_vez:false
            })
          }
          if((!data.tarjetas||(data.tarjetas&&data.tarjetas.length<1))&&data.tipo_def&&data.tipo_def==='Tarjeta') this.addTipo('')
          else this.addTipo(data.tipo_def?data.tipo_def:'')
      })
      .catch(error=>{
          alert(error)
      })
    }
  }

  marcador(e){
    if(!this.state.viajando){
      this.setState({loading:true})
      this.getDireccion(e)
        .then(res=>{
          if(res){
            if(!this.state.point){
              if(this.state.fijar){
                this.setState({
                  punto:{
                    latitude:e.latitude,
                    longitude:e.longitude
                  },
                  direccion:res,
                  address:res,
                  confirm:false,
                  segunda_vez:false,
                  point:true,
                  loading:false
                })
              }
            }else {
              this.setState({
                lugar:res,
                destino:{
                  latitude:e.latitude,
                  longitude:e.longitude
                },
                confirm:false,
                segunda_vez:false,
                loading:true,
              })
              this.cambiarEstado('buscar')
              this.getViaje(e)
            }
          }
        })
        .catch()
      }
      else if(this.state.bloqueado===true){
        this.setState({
          mensaje:'Usted se encuentra bloqueado',
          inicio:true
        })
      }
  }

  getViaje(destino,ida_vuelta=false){
    if(this.state.conexion==='conectado'){
      this.setState({loading:true})
      fetch(`${server}/cliente/`+store.getState().id_user.toString(),{
        method:'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+store.getState().token.toString()
        }
      })
      .then(response=>{
        let data  = JSON.parse(response._bodyText)
        fetch(`${server}/reserva/consulta`,{
          method:'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type':'application/json',
          },
          body:JSON.stringify({
            origen:this.state.punto,
            destino:destino,
            ida_vuelta:ida_vuelta,
            vehiculo:this.state.vehiculo,
            user: store.getState().id_user
          })
        })
        .then(response=>{
          let data = JSON.parse(response._bodyInit)
          if(data.data){
            this.setState({
              segunda_vez:false,
              costo:data.data.costo.toFixed(2),
              tiempo:data.data.tiempo,
              loading: false
            })
            this.getAddress('destino',destino)
            this.getChoferes(this.state.locationResult,this.state.vehiculo)
          }else if(data.status==='error'){
            this.setState({
              segunda_vez:false,
              confirm:false,
              loading: false,
              mensaje:'Ha ocurrido un error',
              inicio:true
            })
          }else{
            this.setState({
              costo:null,
              duration:0,
              loading: false,
              mensaje:'El viaje sobrepasa la distancia máxima permitida para el tipo de vehículo seleccionado',
              inicio:true,
              segunda_vez:false
            })
          }
        })
        .catch(error=>{
          this.setState({
            loading:false,
            mensaje:'Ha ocurrido un error. Verifique su conexión a internet e intente nuevamente.',
            inicio:true
          })
        })
      })
      .catch(error=>{
        this.setState({
          loading:false,
          mensaje:'Ha ocurrido un error. Verifique su conexión a internet e intente nuevamente.',
          inicio:true
        })
      })
    }
  }

  cambiarEstado(estado){
    store.dispatch(createEstado(estado))
    this.setState({
       estatus:estado
     })
  }

  cambiarPunto(){
    this.setState({
      punto:[]
    })
  }

  setVehiculo(vehiculo){
    this.setState({
      vehiculo:vehiculo
    })
    this.getChoferes(this.state.locationResult, vehiculo)
    this.getViaje(this.state.destino,this.state.ida_vuelta)
  }

  setBooking(time=null,book=false,booking=null,conf=false){
    this.setState({
      time:time,
      book:book,
      booking:booking,
      mbook:conf
    })
  }

  crearViaje(){
    if(this.state.conexion==='conectado'){
      fetch(`${server}/reserva`,{
        method:'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+store.getState().token.toString()
        },
        body:JSON.stringify({
          origen:{
            lat: this.state.punto.latitude,
            lng: this.state.punto.longitude
          },
          destino: {
            lat: this.state.destino.latitude,
            lng: this.state.destino.longitude
          },
          booking: this.state.booking,
          vehiculo:this.state.vehiculo===''?'Taxi':this.state.vehiculo,
          ruta_cliente: this.state.ruta,
          tipo:this.state.tipo,
          extras: this.state.ext,
          salida:this.state.direccion,
          llegada:this.state.lugar,
          ida_vuelta:this.state.ida_vuelta
        })
      })
      .then(res=>{
        let data = JSON.parse(res._bodyInit)
        this.setState({
          reserva:data.data,
          viajando:true,
          ext:[],
          choferes:[]
        })
      })
      .catch(error=>{
        alert(error)
      })
    }
  }

  cerrarExtras(){
    this.setState({
      extra:!this.state.extra
    })
  }

  addExt(arr){
    this.setState({
      ext:arr
    })
  }

  setTransId(trans){
    this.setState({
      trans_id:trans
    })
  }

  cerrarViaje(){
    this.setState({
      estatus:'',
      punto:[],
      detalle:true
    })
  }

  valorarViaje(){
    this.setState({
      valorar:false
    })
    if(Platform.OS==='android'){
      this.setmensaje(true)
    }else{
      setTimeout(
        ()=>{this.setmensaje(true)},
        1000
      )
    }
  }

  setIdaVuelta(data){
    this.setState({
      ida_vuelta:data
    })
    this.getViaje(this.state.destino,data)
  }

  pago(state){
    this.setState({
      pago:state
    })
  }

  promo(state){
    this.setState({
      promo:state
    })
  }

  addPay(pay){
    this.setState({
      pay:pay
    })
  }

  verDetalles(){
    this.setState({detalle:!this.state.detalle})
  }

  addTipo(tipo){
    this.setState({
      tipo:tipo
    })
  }

  actTipo(data){
    if(data!==this.state.reserva.tipo){
      this.setState(prevState=>({
        reserva:{
          ...prevState.reserva,
          tipo:data
        }
      }))
    }
  }

  confirmCancelar(){
    this.setState({
      cancelar:!this.state.cancelar
    })
  }

  cancelarViaje(razon=''){
    this.setState({
      cancelar:false,
      punto: [], 
      destino: [],
      chofer: null,
      viaje: null, 
      estatus: '',
      vehiculo:'Taxi',
      ext: [], 
      visible:false,
      cancel_conf:!this.state.cancel_conf,
      razon:razon,
      costo:null,
      viajando:false,
      confirm:false,
      ida_vuelta:false,
      address:'Punto de partida',
      lugar:'¿A donde quieres ir?',
      direccion:'',
      selecDestino:false,
      point:false,
      fijar:false,
      segunda_vez:false
    })
  }

  //Funciones de geolocalizacion


  getLocation(){
    if (this.hasLocationPermission() || Platform.OS === 'ios') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            locationResult:{
              latitude: position.coords.latitude,
              longitude:position.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,                  
            },
            locationResult2:{
              latitude: position.coords.latitude,
              longitude:position.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121, 
            }
          })
          this.position(position)
          this.getChoferes(position)
        },
        (error) => {
            // See error code charts below.
          console.log(error)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      }
      else{
        alert('No se ha autorizado a la aplicacion para usar su ubicacion')
      }
  }
  getLocation2(){
    if (this.hasLocationPermission() || Platform.OS === 'ios') {
      navigator.geolocation.watchPosition(
        (position) => {
          if(!this.state.chofer) this.getLocation()
        },
        (error) => {
          // See error code charts below.
          //alert(error.message);
        },
        { enableHighAccuracy: true, distanceFilter: 1, maximumAge:0 }
      );
    }
  }
  
  position(pos){
    if(store.getState().token!==''&&this.state.conexion==='conectado'){
      fetch(`${server}/cliente/`,{
        method:'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+store.getState().token.toString()
        },
        body: JSON.stringify({
          _id: store.getState().id_user,
          map:{
            lat: pos.coords?pos.coords.latitude:pos.latitude,
            lng: pos.coords?pos.coords.longitude:pos.longitude
          }
        })
      })
      .then(res=>{
        // if(!this.state.chofer) this.getChoferes(pos)
      })
      .catch(error=>{
        alert(error)
      })
    }
  }

  async getAddress(tipo,coord){
    if(this.state.conexion==='conectado' ){
      return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${coord.latitude},${coord.longitude}&key=AIzaSyCeheP7N3nMtkIeE2P56lW1umQM1fyHCwE`)
      .then(res=>{
        let arr = JSON.parse(res._bodyInit)
        let address = arr.results[0].formatted_address
        if(tipo==='origen'){
          this.setState({direccion:address, address:address})
        }else{
          this.setState({lugar:address})
        }
        return coord
      })
      .catch(error=>alert(error))
    }
  }
  async getDireccion(coord){
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${coord.latitude},${coord.longitude}&key=AIzaSyCeheP7N3nMtkIeE2P56lW1umQM1fyHCwE`)
    .then(res=>{
      let arr = JSON.parse(res._bodyInit)
      let address = arr.results[0].address_components[0].long_name+', '+arr.results[0].address_components[1].long_name+', '+arr.results[2].address_components[1].long_name
      return address
    })
    .catch(error=>alert(error))
  
  }
getChoferes(pos, taxi=null){
  console.log(this.state.chofer)
  if(store.getState().token!==''&&this.state.conexion==='conectado'&&!this.state.chofer){
    fetch(`${server}/chofer/cercanos`,{
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type':'application/json',
        'Authorization': 'Bearer '+store.getState().token.toString()
      },
      body: JSON.stringify({
        coords:{
          lat: pos.coords?pos.coords.latitude:pos.latitude,
          lng: pos.coords?pos.coords.longitude:pos.longitude
        },
        taxi:taxi
      })
    })
    .then(res=>{
      let data = JSON.parse(res._bodyInit)
      if(data.data){
        data = data.data
        data.forEach((arr,i) => {
          this.socket.emit('escucha_chofer', arr._id)
          if(this._nodes.get(arr._id) && this.state['chof'+i] && 'coordinates' in this.state['chof'+i]){
            this.setState(prevState=>(
              {['chof'+i]:{
                ...prevState['chof'+i],
                coordinates:new AnimatedRegion({
                  latitude:this.state['chof'+i].coordinates.latitude,
                  longitude:this.state['chof'+i].coordinates.longitude,
                  latitudeDelta:0.01,
                  longitudeDelta:0.01
                }),
                orientacion:new Animated.Value(
                  typeof(this.state['chof'+i].orientacion) === 'number' ? this.state['chof'+i].orientacion :
                  typeof(this.state['chof'+i].orientacion) === 'string' ? parseFloat(this.state['chof'+i].orientacion) :
                  parseFloat(JSON.stringify(this.state['chof'+i].orientacion))
                ),
              }}
            ))
            if (Platform.OS === 'android' && this._nodes.get(arr._id)._component) {
              this._nodes.get(arr._id)._component.animateMarkerToCoordinate({
                latitude:arr.map.lat,
                longitude:arr.map.lng
              })
              Animated.spring(this.state['chof'+i].orientacion,{
                toValue:parseFloat(arr.orientacion),
                easing:Easing.linear,
                duration:500
              }).start()
            }else{
              if(this.state['chof'+i]&&typeof(this.state['chof'+i].coordinates.timing)==='function'){
                let {coordinates} = this.state['chof'+i]
                coordinates.timing({latitude:arr.map.lat,longitude:arr.map.lng}).start()
              }
            }
          }else{
            this.setState({['chof'+i]:{
              coordinates:new AnimatedRegion({
                latitude:arr.map.lat,
                longitude:arr.map.lng,
                latitudeDelta:0.01,
                longitudeDelta:0.01
              }),
              id:arr._id,
              orientacion:new Animated.Value(arr.orientacion),
              vehiculo:arr.vehiculo.tipo
            }})
          }
        });
        this.setState({
          cant:data.length,
          choferes:data
        })
      }
      else{
        this.setState({
          cant:0,
          choferes:[]
        })
      }
      this.setState({stop:false})
      clearTimeout(this.state.timeId)
      this.setState({
        timeId:setTimeout(()=>{
        this.getChoferes(this.state.locationResult)}
        ,10000)
      })
    })
    .catch(error=>{
      console.log(error)
      this.setState({stop:false})
      clearTimeout(this.state.timeId)
      this.setState({
        timeId:setTimeout(()=>{
        this.getChoferes(this.state.locationResult)}
        ,10000)
      })
    })
  }
}

getUltimosViajes(){
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
    if(!reservas.message){
      let destinos=[]
      let llegadas=[]
      reservas.filter(el=>{
        let i = destinos.findIndex(x=>x.salida===el.salida)
        if(i<=-1&&destinos.length<6){
          destinos.push(el)
        }
        return null
      })
      reservas.filter(el=>{
        let i = llegadas.findIndex(x=>x.llegada===el.llegada)
        if(i<=-1&&llegadas.length<6){
          llegadas.push(el)
        }
        return null
      })
      this.setState({destinos:destinos, llegadas:llegadas})
    }else{
      this.setState({destinos:[], llegadas:[]})
    }
  })
  .catch(error=>alert(error))
}

  //Funciones de renderizacion

  showMarkers(){
    let arr=[]
    for(let i =0 ;i<this.state.cant;i++){
      if(this.state['chof'+i]){
        arr.push(
          <Marker.Animated 
            key={'chof'+i} 
            flat={true}
            ref={marker=>this._nodes.set(this.state['chof'+i].id,marker)} 
            coordinate={this.state['chof'+i].coordinates}
            style={ 
              // typeof(this.state['chof'+i].orientacion) === 'number' ?
              {
                width:35, height:40, 
                alignItems: 'center', 
                justifyContent:'center',
                transform:[
                  {rotate: `${JSON.stringify(this.state['chof'+i].orientacion)}deg`},
                  {translateX:-2.5},
                  {translateY:-15}
                ]
              }
              // :
              // {
              //   width:35, height:40, 
              //   alignItems: 'center', 
              //   justifyContent:'center',
              //   transform:[
              //     {translateX:-2.5},
              //     {translateY:-15}
              //   ]
              // }
            }
          >
            {
              this.state['chof'+i].vehiculo==='Taxi'?
                <Animated.Image 
                  source={require('../../src/assets/images/taxi2.png')} 
                  resizeMode='contain'
                  style={{
                    height:40, 
                    width:35,
                  }}
                />:
                <Animated.Image 
                  source={require('../../src/assets/images/moto2.png')} 
                  resizeMode='contain'
                  style={{
                    height:40, 
                    width:35,
                  }}
                />
            } 
          </Marker.Animated>
        )
      }
    }
    return arr
  }

  centrar(){
    this.mapView.animateToRegion(this.state.locationResult)
  }

  cerrarModal(option){
    if(option==='nopago'){
      this.setState({
        nopago:false
      })
    }
  }

  mostrarModal(option){
    if(option==='buscar'){
      this.setState({
        visible:true
      })
    }
    else{
      this.setState({
        nopago:true
      })
    }
  }

  mostrarBase(){
      switch(this.state.estatus){
        case 'buscar':
          return (
            <Base
              cant={this.state.cant}
              destino={this.state.destino}
              costo ={this.state.costo}
              distancia={this.state.distancia}
              duration={this.state.duration}
              cambiarEstado={this.cambiarEstado}
              pago={this.pago}
              promo = {this.promo}
              vehiculo = { this.setVehiculo}
              setBooking={this.setBooking}
              setVehiculo = {this.setVehiculo}
              cerrarExtras ={this.cerrarExtras}
              tipo = {this.state.tipo}
              mostrarModal = {this.mostrarModal}
              setIdaVuelta={this.setIdaVuelta}
              addPay ={this.addPay}
              conexion={this.state.conexion}
            />
          )
        break;
        case 'Aceptado':
          return (
            <Conductor 
              chofer={this.state.chofer} 
              reserva={this.state.reserva} 
              cancelarViaje={this.cancelarViaje}
              confirmCancelar = {this.confirmCancelar}
              chofer={this.state.chofer}
            />
          )
        break;
        case 'confirmar':
          return (
            <Confirmacion 
              direccion={this.state.direccion} 
              crearViaje = {this.crearViaje} 
              cambiarEstado = {this.cambiarEstado}
              cambiarPunto = {this.cambiarPunto}
              mostrarModal = {this.mostrarModal}  
            />
          )
        break;
        case 'Iniciado':
        return(
          <Iniciar
            cancelar = {this.cancelar}
            chofer={this.state.chofer} 
            reserva={this.state.reserva}
            cambiarEstado = {this.cambiarEstado}
            chofer={this.state.chofer}
          />
        )
        break;
        case 'Comenzado':
          return(
            <Viaje
            cerrarViaje={this.cerrarViaje}
            reserva={this.state.reserva}
            chofer={this.state.chofer}
          />
          )
          break;
          case 'pago':
          return(
            <Pagar
              tipo={this.state.tipo}
              costo={this.state.costo}
              mostrarModal={this.mostrarModal}
              addPay={this.addPay}
              addTipo ={this.addTipo}
              crearViaje ={this.crearViaje}
              cambiarEstado={this.cambiarEstado}
              setTransId = {this.setTransId}
              conexion={this.state.conexion}
            />
          )
          break;
        default:
      }
  }

  cabecera(){
    if(this.state.punto.length===0){
      return (
        <View style={{zIndex: Platform.select({ ios:5 })}}>
          {Platform.OS!='ios' &&(
            <Head
            name='Home' 
          />   
          )}
          <Button
            transparent
            name='menu'
            style={styles.back}
            onPress={()=>this.props.navigation.openDrawer()}
          >
            <Icon
              name='menu'
              style={{color:'black', fontSize:30}}
            />
          </Button>
        </View>
      )
    }
    else if(this.state.estatus === 'buscar' ||
    this.state.estatus==='confirmar' ||
    this.state.estatus==='pago' || 
    (this.state.punto.latitude && 
      this.state.estatus != 'Comenzado' && 
      this.state.estatus != 'Aceptado' && this.state.estatus != 'Iniciado')){
      return (
        <View style={{zIndex: Platform.select({ ios:5 })}}>
          {Platform.OS!='ios' &&(
          <Head
            name='Home'
          />
          )}
          <Button
            danger
            style={styles.back}
            onPress={()=>{
              this.cancelar()
              Keyboard.dismiss()
              if(this.busquedaD){
                this.busquedaD.triggerBlur()
              }
            }}
          >
            <Icon
              name='arrow-back'
            />
          </Button>
        </View>
      )
    }
  }

  googleBarra(tipo){
    if(this.state.destino.length<1){
      return(
        <GooglePlacesAutocomplete
          placeholder={tipo==='origen'?this.state.address:this.state.lugar}
          minLength={2}
          autoFocus={false}
          returnKeyType={'default'}
          fetchDetails={true}
          currentLocation={tipo==='origen'?true:false}
          currentLocationLabel={this.state.address}
          listViewDisplayed='true'
          renderDescription={row => row.description}
          nearbyPlacesAPI='GooglePlaceSearch'
          ref={ref=>{tipo==='destino'?this.busquedaD=ref:this.busquedaO=ref}}
          textInputProps={{
            onFocus:()=>{
              if(tipo==='destino'){
                if(!this.state.punto.latitude){
                  this.getAddress('origen',this.state.locationResult)
                  .then(res=>{
                      this.setState({
                        punto:{
                          latitude: this.state.locationResult.latitude,
                          longitude: this.state.locationResult.longitude,
                        }
                      })
                  })
                }
                this.setState({selecDestino:true,point:true, fijar: false, confirm: false})
              }else{
                // if(this.state.fijar===false){
                //   alert('aqui primero')
                //   this.setState({
                //     address:' ',
                //     point:false,
                //     fijar:true,
                //     confirm:true,
                //     selecDestino:false
                //   })
                // }else{
                  this.setState({
                    address:'',
                    selecDestino:false,
                    point:false,
                    confirm: false, 
                    segunda_vez: false
                  })
                // }
              }
            },
            onChangeText:text=>{
              if(tipo==='origen'){
                if(this.barra){
                  if(text!==''){
                    this.barra.setNativeProps({
                      style:{
                        zIndex:0
                      }
                    })
                  }else{
                    this.barra.setNativeProps({
                      style:{
                        zIndex:1000
                      }
                    })
                  }
                }
                return null
              }else{
                if(this.barraD){
                  if(text!==''){
                    this.barraD.setNativeProps({
                      style:{
                        zIndex:0
                      } 
                    })
                  }else{
                    this.barraD.setNativeProps({
                      style:{
                        zIndex:1000
                      }
                    })
                  }
                }
              }
            }
          }}
          onPress={(data, details=null)=>{
            if(tipo==='origen'){
              this.setState({
                punto: {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                },
                address:data.description,
                point:true
              })
              this.mapView.animateToCoordinate(this.state.punto) 
            }else{
              this.setState({
                selecDestino:false,
                segunda_vez: false,
                punto:{
                  latitude: this.state.punto.latitude?this.state.punto.latitude:this.state.locationResult.latitude,
                  longitude:this.state.punto.latitude?this.state.punto.longitude:this.state.locationResult.longitude
                },
                destino:{
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng
                }
              })
              this.mapView.animateToCoordinate(this.state.destino)
              this.getViaje(this.state.destino)
              this.cambiarEstado('buscar') 
            }
          }
        }
          getDefaultValue={()=>''}
          query={{
            key:'AIzaSyCeheP7N3nMtkIeE2P56lW1umQM1fyHCwE',
            language:'es',
            components: 'country:do'
          }}
          styles={{
              zIndex:2000,
              flex:1,
              position:'absolute',
              alignItems:'flex-start',
              justifyContent:'flex-start',
              textInputContainer: {
                backgroundColor: '#fff',
                borderTopWidth: 0,
                borderRadius: 25,
                borderBottomWidth:0,
                top:Platform.select({ios:100, android:20}),
              },
              textInput: {
                borderRadius: 25,
              },
              description: {
                fontWeight: 'bold',
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
              listView: {
                color: 'black', //To see where exactly the list is
                zIndex: 2000, //To popover the component outwards
                marginTop: Platform.select({ios:120, android:20}),
                backgroundColor:'white'
              }   
          }}
          debounce={200}
          renderRighButton={()=>
            <Button>
              <Icon name='search' />
            </Button>
          }
        />  
      )
    }
    else{
      return null
    }
  }

  render() {
    return (
      <Container >
      <Buscando 
        visible={this.state.visible} 
        cancelarViaje={this.cancelarViaje} 
        reserva={this.state.reserva}/>
      <Valorar 
        visible={this.state.valorar} 
        valorarViaje={this.valorarViaje}
        reserva= {this.state.reserva}
        conexion={this.state.conexion}/>
      <Cancelar 
        visible={this.state.cancelar} 
        cancelar={this.cancelar} 
        cancelarViaje={this.cancelarViaje} 
        confirmCancelar={this.confirmCancelar} 
        reserva={this.state.reserva}
        conexion={this.state.conexion}/>
      <Extras 
        visible={this.state.extra}
        cerrarExtras ={this.cerrarExtras}
        addExt={this.addExt}
        extras={this.state.ext}
        conexion={this.state.conexion}/>
      <Promo 
        visible={this.state.promo} 
        promo={this.promo}/>
      <Pago 
        visible={this.state.pago} 
        pago={this.pago}
        addTipo={this.addTipo}/>
      <Booking
        visible={this.state.book} 
        time={this.state.time} 
        crearViaje={this.crearViaje} 
        cancelar={this.cancelar}
        costo={this.state.costo}
        tipo={this.state.tipo} 
        setBooking={this.setBooking}
        conexion={this.state.conexion}/>
      <BookConfirm 
        visible={this.state.mbook} 
        setBooking={this.setBooking}/>
      <CancelConfirm  
        visible={this.state.cancel_conf} 
        cancelarViaje={this.cancelarViaje} 
        razon={this.state.razon}
        reserva={this.state.reserva}  
      />
      <PagoConfirm
        visible={this.state.nopago}
        pay={this.state.pay}
        cerrarModal = {this.cerrarModal}
      />
      <Detalles 
        visible={this.state.detalle} 
        verDetalles={this.verDetalles}
        reserva={this.state.reserva}
        tipo={this.state.tipo}
        terminar={this.terminar}
        pago={this.state.pagado}
        conexion={this.state.conexion}
        addTipo={this.addTipo}
        actTipo={this.actTipo}
      />
      <Cargando visible={this.state.loading} />
      <Mensaje mensaje={this.state.mensaje} visible={this.state.inicio} setmensaje={this.setmensaje}/>
        {this.cabecera()}
        <View  style={styles.content}>
            <View style={{
              flex:1 ,
              width: Dimensions.get('window').width*0.9, 
              justifyContent:'flex-start', 
              position:'absolute', 
              borderRadius:25, 
              marginTop:20,
              zIndex:5
            }}>
              {this.state.punto.latitude&&
              <View style={{zIndex:1000, flexDirection:'column-reverse'}}>
                  {this.googleBarra('origen')}
              </View>
              }
              {this.state.address.length<1&&
              <View ref={ref=>this.barra=ref} style={{zIndex:1000, marginTop: Platform.select({ios: 100, android: 30}),flexDirection:'column-reverse'}}>
                <View style={{
                  width:ancho*0.9,
                  borderRadius:15,
                  backgroundColor:'white',
                  height:'auto'
                }}>
                <TouchableHighlight 
                    underlayColor='transparent'  
                    onPress={()=>{
                      this.getAddress('origen',this.state.locationResult)
                      .then(res=>{
                        this.setState({
                          punto:{
                            latitude:this.state.locationResult.latitude,
                            longitude:this.state.locationResult.longitude
                          },
                          confirm:false,
                          fijar:false,
                          point:true,
                          segunda_vez:false
                        })
                        this.mapView.animateToRegion(this.state.locationResult)
                      })
                    }}
                    style={{height:40,borderBottomColor:'#cac6c6', borderBottomWidth:1, justifyContent:'center', marginLeft:5}}
                  >
                    <Text style={{textAlign:'left', color:'#cac6c6'}}>Ubicacion actual</Text>
                  </TouchableHighlight>
                  <TouchableHighlight 
                    underlayColor='transparent'  
                    onPress={()=>this.setState({confirm:true, address:' ', fijar:true, point:false},Keyboard.dismiss())}
                    style={{height:40,borderBottomColor:'#cac6c6', borderBottomWidth:1, justifyContent:'center', marginLeft:5}}
                  >
                    <Text style={{textAlign:'left', color:'gray'}}>Fijar Posicion</Text>
                  </TouchableHighlight>
                  <View style={{height:this.state.destinos.length>6?300:this.state.destinos.length*45, backgroundColor:'white', marginTop:5, marginBottom:5}}>
                    <ScrollView>
                      {this.state.destinos.map((item,i)=>{
                        return(
                          <TouchableHighlight 
                            key={'sal'+i}
                            underlayColor='transparent' 
                            style={{
                              justifyContent:'flex-start', 
                              alignItems:'center',
                              borderBottomColor:'#cac6c6', 
                              borderBottomWidth:1, 
                              marginLeft:5,
                              marginVertical:3
                            }}
                            onPress={()=>{
                              this.setState({
                                address:item.salida,
                                punto:{
                                  latitude:item.origen.lat,
                                  longitude:item.origen.lng
                                },
                                confirm:false,
                                fijar:false,
                                point:true,
                                segunda_vez:false
                              })
                              Keyboard.dismiss()
                              this.mapView.animateToCoordinate({
                                latitude:item.origen.lat,
                                longitude:item.origen.lng
                              })
                          }}
                          >
                            <Text style={{textAlign:'left', color:'gray'}}>{item.salida}</Text>
                          </TouchableHighlight>
                        )
                      })}
                    </ScrollView>
                  </View>
                </View>
              </View>
              }{this.state.address!==''&&
                <View style={{zIndex:5,marginTop:this.state.punto.latitude?10:0,flexDirection:'column-reverse'}}>
                  {this.googleBarra('destino')}
                </View>
              }
              {this.state.selecDestino&&
                <View ref={ref=>this.barraD=ref} style={{zIndex:1000, marginTop:Platform.select({ios: 110, android: 30}),flexDirection:'column-reverse'}}>
                  <View style={{
                    width:ancho*0.9,
                    borderRadius:15,
                    backgroundColor:'white',
                    height:'auto'
                  }}>
                  <TouchableHighlight 
                      underlayColor='transparent'  
                      onPress={()=>{
                        this.getAddress('destino',this.state.locationResult)
                        .then(res=>{
                          this.setState({
                            destino:{
                              latitude:this.state.locationResult.latitude,
                              longitude:this.state.locationResult.longitude
                            },
                            selecDestino:false,
                            confirm:false
                          })
                          this.mapView.animateToRegion(this.state.locationResult)
                          this.getViaje(this.state.destino)
                          this.cambiarEstado('buscar')
                        })
                      }}
                      style={{height:40,borderBottomColor:'#cac6c6', borderBottomWidth:1, justifyContent:'center', marginLeft:5}}
                    >
                      <Text style={{textAlign:'left', color:'gray'}}>Ubicacion actual</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                      underlayColor='transparent'  
                      onPress={()=>this.setState({confirm:true, lugar:' ',selecDestino:false ,fijar:true, point:true},Keyboard.dismiss())}
                      style={{height:40,borderBottomColor:'#cac6c6', borderBottomWidth:1, justifyContent:'center', marginLeft:5}}
                    >
                      <Text style={{textAlign:'left', color:'gray'}}>Fijar Posicion</Text>
                    </TouchableHighlight>
                    <View style={{height:this.state.llegadas.length>6?300:this.state.llegadas.length*45, backgroundColor:'white', marginTop:5, marginBottom:5}}>
                      <ScrollView>
                        {this.state.llegadas.map((item,i)=>{
                          return(
                            <TouchableHighlight
                              key = {'lle'+i} 
                              underlayColor='transparent' 
                              style={{
                                justifyContent:'flex-start', 
                                alignItems:'center',
                                borderBottomColor:'#cac6c6', 
                                borderBottomWidth:1, 
                                marginLeft:5,
                                marginVertical:3
                              }}
                              onPress={()=>{
                                this.setState({
                                  address:item.llegada,
                                  destino:{
                                    latitude:item.destino.lat,
                                    longitude:item.destino.lng
                                  },
                                  selecDestino:false,
                                  confirm:false
                                })
                                Keyboard.dismiss()
                                this.mapView.animateToCoordinate({
                                  latitude:item.destino.lat,
                                  longitude:item.destino.lng
                                })
                                this.getViaje({latitude:item.destino.lat,longitude:item.destino.lng})
                                this.cambiarEstado('buscar')
                            }}
                            >
                              <Text style={{textAlign:'left', color:'gray'}}>{item.llegada}</Text>
                            </TouchableHighlight>
                          )
                        })}
                      </ScrollView>
                    </View>
                  </View>
                </View>
                }
            </View>
            <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                initialRegion={this.state.locationResult2}
                showsUserLocation={true}
                ref={el => (this.mapView = el)}
                loadingEnabled
                showsMyLocationButton={false}
                tracksViewChanges={false}
                onTouchStart={data =>{
                  if(this.state.confirm){
                    this.setState({segunda_vez: false})
                  }
                }}
                onTouchEnd={data =>{
                  if(this.state.fijar&&!this.state.segunda_vez){
                    this.setState({segunda_vez: true})
                  }
                }}
                onRegionChangeComplete={region=>{
                  if(Platform.OS ==='ios'){
                    if(this.state.fijar&&!this.state.segunda_vez){
                      this.setState({segunda_vez: true})
                    }
                  }
                  if(this.state.fijar){
                    this.setState({locationResult2:region})
                    if(this.state.point){
                      this.getAddress('destino',region)
                    }else{
                      this.getAddress('origen',region)
                    }
                  }
                }}
            >
              {this.state.punto.latitude&&this.state.destino.latitude&&this.state.chofer?
                <Marker.Animated
                  flat={true}
                  ref={ref=>this.chofer=ref}
                  style={ typeof(this.state.chofer.orientacion) === 'number' ?
                    {
                      width:35, height:40, 
                      alignItems: 'center', 
                      justifyContent:'center',
                      transform:[
                        {rotate: `${ parseFloat(JSON.stringify(this.state.chofer.orientacion)) }deg`},
                        {translateX:-2.5},
                        {translateY:-20}
                      ]
                    } :
                    {
                      width:35, height:40, 
                      alignItems: 'center', 
                      justifyContent:'center',
                      transform:[
                        {translateX:-2.5},
                        {translateY:-20}
                      ]
                    }
                  }
                  coordinate={
                    Platform.OS==='android'?{latitude:this.state.chofer.map.lat,longitude:this.state.chofer.map.lng}
                    :this.state.chofCoords
                  }
                >
                  {
                    this.state.chofer.vehiculo.tipo==='Taxi'?
                    <Image 
                      source={require('../../src/assets/images/taxi2.png')} 
                      resizeMode='contain'
                      style={{height:40, width:35}}
                    />:  
                    <Image 
                      source={require('../../src/assets/images/moto2.png')} 
                      resizeMode='contain'
                      style={{height:40, width:35}}
                    />  
                  }
                </Marker.Animated>
              :null}
              {(this.state.punto.length>0 || this.state.punto.latitude)? 
                <Marker coordinate={this.state.punto}>
                  <Image 
                    source={require('../../src/assets/images/inicio.png')} 
                    resizeMode='contain'
                    style={{height:40, width:35}}
                  />
                </Marker>
                : null}
              {(this.state.destino.length>0 || this.state.destino.latitude)? 
                <Marker coordinate={this.state.destino}>
                  <Image 
                    source={require('../../src/assets/images/llegada.png')} 
                    resizeMode='contain'
                    style={{height:40, width:35}}
                  />
                </Marker>
                : null}
              {this.state.choferes.length>0 
                && !this.state.chofer &&
                  this.showMarkers()
              }
              {this.state.punto && this.state.punto.latitude && this.state.punto.longitude && (
                <Fragment>
                  <Directions
                    strokeColor='#ca0f27'
                    origin={this.state.punto}
                    destination={this.state.destino}
                    onReady={result => {
                      this.setState({ 
                        duration: Math.floor(result.duration),
                        distancia: result.distance,
                        ruta: result.coordinates
                       });
                      if(this.state.estatus==='Aceptado'){
                        this.mapView.animateToRegion({
                          latitude:this.state.chofer.map.lat,
                          longitude:this.state.chofer.map.lng,
                          latitudeDelta:0.01,
                          longitudeDelta:0.01
                        })
                      }else{
                        this.mapView.fitToCoordinates(result.coordinates, {
                          edgePadding: {
                            right: getPixelSize(50),
                            left: getPixelSize(50),
                            top: getPixelSize(100),
                            bottom: getPixelSize(300)
                          }
                        });
                      }
                    }}
                  />
                </Fragment>
              )}
              {this.state.ida_vuelta===true?(
                <Fragment>
                  <Directions
                    strokeColor='#3629dc'
                    origin={this.state.destino}
                    destination={this.state.punto}
                    onReady={result => {
                      this.setState({ 
                        duration: Math.floor(result.duration),
                        distancia: result.distance,
                        ruta: result.coordinates
                       });
                      this.mapView.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: getPixelSize(50),
                          left: getPixelSize(50),
                          top: getPixelSize(100),
                          bottom: getPixelSize(300)
                        }
                      });
                    }}
                    
                  />
                </Fragment>
              ):null}
            </MapView>
            <View style={[styles.center,{
              marginTop:Platform.select({android: -50, ios: 70}),
              marginRight:30,
              zIndex:5
            }]}
            >
              <TouchableHighlight
                onPress={()=>{
                  this.centrar()}
                }
              >
                <Icon name='locate' style={{fontSize:45,color:'#E84546'}} onPress={()=>this.centrar()}/>
              </TouchableHighlight>
            </View>
            <View style={[
              styles.base,
              Platform.OS==='ios'?
              {
                position:'absolute',
                bottom:5
              }:
              null
            ]}>
              {this.mostrarBase()}
            </View>
            {this.state.confirm &&(
            <View style={{
              width: 40, 
              height:40,
              position: 'absolute', 
              marginTop:Platform.OS=== 'ios'?Dimensions.get('window').height/2.1:Dimensions.get('window').height/2.8, 
              alignItems: 'center', 
              backgroundColor: 'transparent',
              justifyContent: 'center'}}
            >
              <Image 
                source={require('../../src/assets/images/pin.png')} 
                resizeMode='contain'
                style={{height:40, width:35, marginBottom: 39}}
              />   
           
            </View>

             )}
            {/* {
              console.log('error de boton '+this.state.segunda_vez + ' ' +this.state.estatus)
            } */}
            {this.state.segunda_vez && this.state.estatus===''&&(
              <View
            style={
              Platform.OS === 'android' ?
              {
                width: Dimensions.get('window').width, 
                justifyContent:'center', 
                alignItems: 'center',
                marginBottom: 30,
                justifyContent: 'space-around',
                zIndex: 5
              }:
              {
                width: Dimensions.get('window').width, 
                position:'absolute',
                justifyContent:'center', 
                alignItems: 'center',
                bottom: 30,
                justifyContent: 'space-around',
                zIndex: 5
              }
            }
            >
            <TouchableHighlight underlayColor={'transparent'}
              disabled={!this.state.confirm}
              onPress={()=>{
                // if(this.state.viajando){
                //   this.setState({
                //     viajando:false
                //   },
                // }
                this.marcador(this.state.locationResult2)
              }}  
            >
              <View>
                  <Button
                    disabled={!this.state.confirm}  
                    rounded 
                    onPress={()=>{
                      // if(this.state.viajando){
                      //   this.setState({
                      //     viajando:false
                      //   })
                      // }
                      this.marcador(this.state.locationResult2)
                    }} 
                    style={{
                      backgroundColor: 'black',
                      width:Dimensions.get('window').width*0.6,
                      justifyContent:'center',
                    }}>
                    <Text>
                    {!this.state.point?'Fijar posicion':'Confirmar'}
                    </Text>
                  </Button>
                </View>
            </TouchableHighlight>  
            </View>
            )}
        </View>
      </Container>
    );
  }
}

export default withNavigationFocus(HomeScreen)

const ancho = Dimensions.get('window').width
const alto = Dimensions.get('window').height

const styles = StyleSheet.create({
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
  center:{
    width:ancho,
    alignItems:'flex-end'
  },
  map: {
    position:'absolute',
    width: Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    top:0,
    marginTop:Platform.OS === 'ios'?0:-Dimensions.get('window').height*0.11
  },
  back: {
    zIndex:2000,
    position: 'absolute',
    top: Platform.select({ ios: 60, android: 40 }),
    left: 20
  }
   });