import React from "react";
import { TouchableHighlight, StyleSheet, Image, Dimensions, AsyncStorage,BackHandler, PermissionsAndroid,Alert } from "react-native";
import { Container,Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Form, Item, Input, Header, Spinner } from "native-base";
import HomeScreen from '../../HomeScreen/index'
import Registro from '../../Registro'
import {createAppContainer, createStackNavigator, withNavigationFocus} from 'react-navigation'
import store from '../../redux/store'
import {  createId,createToken, setLocation, setConexion } from "../../redux/actions";
import {server} from '../Api/index'
import Mensaje from '../Modals/Mensajes'
import NetInfo from '@react-native-community/netinfo'
import Password from "./Password";
class Login extends React.Component {
  constructor(){
    super()
    this.state={
      estatus: false,
      iniciosesion:false,
      mensaje:'',
      visible:false,
      telefono:'',
      password:'',
      token:'',
      valido:false,
      conexion:'',
      ver:false
    }
    this.setmensaje=this.setmensaje.bind(this)
    this.hasLocationPermission()
  }
  static navigationOptions = {
    header:null
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
      data.userId = await AsyncStorage.getItem('userId') || null;
      data.token = await AsyncStorage.getItem('token') || null;
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
    return data;
  }
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        )
            
        NetInfo.isConnected.fetch().done(isConnected=>{
            if(isConnected===true){
                this.setState({conexion:'conectado'})
                store.dispatch(setConexion('conectado'))
            }
            else{
                this.setState({conexion:'desconectado'})
                store.dispatch(setConexion('desconectado'))
            }
        })
    }

    _handleConnectivityChange=isConnected=>{
        if(isConnected===true){
            this.setState({conexion:'conectado'})
            store.dispatch(setConexion('conectado'))
        }
        else{
            store.dispatch(setConexion('desconectado'))
            this.setState({
                conexion:'desconectado', 
                mensaje:'Su dispositivo no tiene una conexion a internet',
                visible:true
            })
        }
    }

  setmensaje(data){
    this.setState({
        visible:data
    })
  }

componentDidUpdate(prevProps){
    if(this.props.isFocused===true&&store.getState().location==='Login'){
        this.validar()
    }
}

componentWillMount(){
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

  handleBackPress=()=>{
    let data = store.getState().location.toString()
    if(data==='Home'||data==='Login'){
        BackHandler.exitApp()
        return true
    }
    else{
        return false
    }
  }

    validar(){
        if(this.state.conexion==='conectado'){
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
                    this.props.navigation.navigate('Home')
                }
            })
            .catch(error=>{
                alert(error)
                this.setState({token:'no'})
            })
        }       
    }

  login(){
    if(this.state.password!=='' && this.state.telefono!==''&&this.state.conexion==='conectado'){
        fetch(`${server}/cliente/login`, {
            method:'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                telefono:this.state.telefono,
                password: this.state.password
            })
        })
        .then((response)=>{
            this.setState({iniciosesion:false})
            let data = response._bodyText
            data = JSON.parse(data)
            if(data.status.toString()=='denied'){
                this.setmensaje(true)
                this.setState({
                    mensaje:data.message
                })
            }
            else{
                AsyncStorage.setItem('token',data.token)
                AsyncStorage.setItem('userId',data.id)
                store.dispatch(createToken(data.token))
                store.dispatch(createId(data.id))
                this.setState({
                    telefono:'',
                    password:''
                })
                this.props.navigation.navigate('Home')
                store.dispatch(setLocation('Home'))
            }
        })
        .catch(error=>{
        })
    }
  }


  render() {
    if(!this.state.isReady){
        return null
    }
    if(this.state.token==='no'){
        return (
            <Container>
                <Header style={styles.header}>
                    <Title style={{color:'white'}}>
                        Iniciar Sesión
                    </Title>
                </Header>
                <Content style={style.fondo}>    
                <Mensaje visible={this.state.visible} setmensaje={this.setmensaje} mensaje={this.state.mensaje}/>
                    <View>
                        <Image
                            resizeMode= 'contain'
                            style={styles.logo}
                            source={require('../../assets/images/logo.png')}
                        />
                        <View>
                            <View style={style.content}>
                                <Icon style={{color: '#E84546', paddingLeft: 10 }} name='call' />
                                <Input placeholder='Numero Movil'
                                    keyboardType={'numeric'}
                                    maxLength={10} 
                                    value={this.state.telefono}
                                    onChangeText={(text)=>{this.setState({telefono:text})}}/>
                            </View>
                            <View style={style.content}>
                                <Icon style={{color: '#E84546', paddingLeft: 10 }} name='lock' />
                                <Input  placeholder='Contraseña'
                                    secureTextEntry={!this.state.ver}
                                    value={this.state.password}
                                    onChangeText={(text)=>{this.setState({password:text})}}
                                >
                                </Input>
                                <Icon style={{color: '#E84546', paddingLeft: 10 }} name={this.state.ver?'eye-off':'eye'} 
                                    onPress={()=>this.setState({ver:!this.state.ver})}
                                />
                            </View>
                        </View>
                        {/*<View style={{justifyContent:'center'}}>
                            <Text style={{color: '#E84546', fontSize: 12, textAlign:'center'}}>Se te olvido tu Contraseña?</Text>
                        </View>
                        */}
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', margin:20}}>
                            <Button 
                                style={this.state.iniciosesion?styles.no_btn:styles.boton}
                                disabled={this.state.iniciosesion?true:false}
                                onPress={()=>this.props.navigation.navigate('Registro')}
                            >
                                <Text style={{fontSize: 12, margin: 0}}>Registrarse</Text>
                            </Button>
                            <Button
                                disabled={this.state.telefono===''||this.state.password===''||this.state.iniciosesion?true:false} 
                                style={this.state.telefono===''||this.state.password===''||this.state.iniciosesion?styles.no_btn:styles.boton}
                                onPress={()=>{
                                    this.setState({
                                        iniciosesion:true
                                    })
                                    this.login()
                                }}    
                            >
                                <Spinner color='red' style={this.state.iniciosesion?styles.cargando:styles.nocargando}/>
                                <Text style={{fontSize: 12, margin: 0}}>
                                    Iniciar Sesión
                                </Text>
                            </Button>
                        </View>
                        <View style={{justifyContent:'center'}}>
                            <TouchableHighlight underlayColor='transparent'
                                onPress={()=>this.props.navigation.navigate('Password')}
                            >
                                <Text style={{textAlign:'center', color:'#E84546', fontWeight:'bold'}}>¿Olvido su contraseña?</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    </Content>
                </Container>
            );
        }
        else{
            return (
                <View style={estilo.vista}>
                    <Spinner color='red' style={estilo.cargando}/>
                </View>
            )
        }
    }
}

const appNavigator = createStackNavigator(
    {
    Login:withNavigationFocus(Login),
    Home: HomeScreen,
    Registro: Registro,
    Password:Password
    },
    {
        headerMode:"none",
        navigationOptions:{
            headerVisible:false,

        },
        defaultNavigationOptions:{
            gestureEnabled:false,
        }
    } 
)

export default createAppContainer(appNavigator)

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

const styles = StyleSheet.create({
    no_btn:{
        backgroundColor: 'grey',
        borderRadius: 25,
        height: 35,
        fontSize: 10,
        padding: 10
    },
    boton: {
        backgroundColor: '#E84546',
        borderRadius: 25,
        height: 35,
        fontSize: 10,
        padding: 10
    },
    logo:{
        width: Dimensions.get('window').width,
        height: 150
    },
    header:{
        backgroundColor: '#E84546',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'red'
    },
    cargando:{
        marginLeft: 20,
        width:20,
        height: 20,
        fontSize: 10
    },
    nocargando:{
        display: 'none'
    },
   });

   const style = StyleSheet.create({
    precio: {
        fontWeight: 'normal',
        color: '#E84546'
    },
    texto:{
        color: '#818181',
        fontSize: 12,
        fontWeight: 'normal'
    },
    costo: {
        color: '#818181',
        fontWeight: 'bold',
        textAlign: 'right'
    },
    view:{
        margin: 0
    },
    text: {
        color:'white'
    },
    titulo:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        backgroundColor: '#E84546',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        
    },
    fondo:{
        marginBottom: -1,
        margin:0,
        marginHorizontal: 0,
        backgroundColor:'#FFFFFF',
        height: Dimensions.get('window').height,
        width:Dimensions.get('window').width + 1
    },
    content:{
        flex: 1,
        paddingLeft: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        height:50,
        paddingHorizontal: 20,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 25,
        backgroundColor: '#fff'
    }
})