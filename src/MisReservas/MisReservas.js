import React from "react";
import { Modal, StyleSheet, Dimensions,TouchableHighlight} from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Header, TabHeading, List, Spinner, Input } from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import {withNavigationFocus} from 'react-navigation' 
import Head from '../componentes/Header/Header.js'
import Cargando from '../componentes/Modals/Cargando' 
import store from '../redux/store'
import {server} from '../componentes/Api'
import {BackHandler, ToastAndroid} from 'react-native'
import moment from 'moment'
import 'moment/locale/es'
import { ScrollView } from "react-native-gesture-handler";
import { setLocation } from "../redux/actions.js";
import Mensaje from "../componentes/Modals/Mensajes.js";
class MisReservas extends React.Component {
  constructor(){
    super()
    this.state={
      location:'MisReservas',
        terminadas:[],
        listas:[],
        visible:true,
        descripcion:'',
        show:false,
        ver:false,
        loading:false,
        dev:null,
        mensaje:''
    }
    this.setmensaje = this.setmensaje.bind(this)
    this.creatDev = this.creatDev.bind(this)
  }

  componentDidMount() {
    this.getReservas()
    this.setState({
        location:'Mis Reservas'
    })
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

  creatDev(){
    if(store.getState().conexion==='conectado'){
        this.setState({loading:true})
        fetch(`${server}/devolucion`,{
            method:'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body:JSON.stringify({
                cliente:this.state.dev.user._id,
                chofer:this.state.dev.driver._id,
                total:this.state.dev.total,
                reserva:this.state.dev._id,
                descripcion:this.state.descripcion
            })
        })
        .then(res=>{
            let data = JSON.parse(res._bodyInit)
            if(data.error){
                this.setState({
                    loading:false,
                    ver:true,
                    mensaje:data.error
                })
            }else{
                this.setState({
                    loading:false,
                    ver:true,
                    mensaje:'Se ha registrado su solicitud de devolución, soporte la evaluará y de ser necesario se pondrá en contacto con usted.'
                })
            }
        })
        .catch(error=>alert(error))
    }
  }

  getReservas(){
    if(store.getState().conexion==='conectado'){
        this.setState({
            visible:true
        })
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
            let listas=[]
            let terminadas=[]
            for(let i=0;i<reservas.length;i++){
                if(reservas[i].estatus==='Pendiente'){
                    listas.push(reservas[i])
                }
                else if(reservas[i].estatus==='Terminado'){
                    terminadas.push(reservas[i])
                }
            }
            listas.length>0?this.setState({listas:listas}):this.setState({listas:[]})
            terminadas.length>0?this.setState({terminadas:terminadas}):this.setState({terminadas:[]})
            this.setState({
                visible:false
            })
        })
        .catch(error=>{
            alert(error)
            this.setState({
                visible:false
            })
        })
    }
  }

  renderModal(){
      return (
          <Modal
            visible={this.state.show}
          >
            <View
                style={{
                    justifyContent:'center', 
                    alignItems:'center', 
                    width:ancho, 
                    height:alto, 
                    backgroundColor:'#000000c2',
                    flex:1
                }}
            >
                <View style={{
                    borderRadius:10, 
                    backgroundColor:'#d6d6d6',
                    borderWidth:1,
                    borderColor:'red',
                    height:alto*0.5, 
                    width:ancho*0.9,
                    alignItems:'center',
                    justifyContent:'flex-start'
                }}>
                    <Text style={{marginTop:10, color:'black', fontSize:18}}>
                        Escribanos la razón de su devolución
                    </Text>
                    <View style={{
                        borderRadius:10, 
                        borderWidth:1, 
                        borderColor:'black', 
                        width:ancho*0.8,
                        height:alto*0.3,
                        marginTop:10
                    }}>
                        <Input
                            placeholder='Describa la razón...'
                            style={{textAlignVertical:'top', width:ancho*0.75, height:alto*0.25}}
                            onChangeText={text=>this.setState({descripcion:text})}
                            multiline={true}
                            numberOfLines={10}
                        />
                    </View>
                    <View style={{
                        flexDirection:'row', 
                        width:ancho*0.8, 
                        justifyContent:'space-around',
                        marginTop:10
                    }}>
                        <Text style={estilo.boton} onPress={()=>this.setState({show:false})}>
                            Cancelar
                        </Text>
                        <Text style={estilo.boton} onPress={()=>this.setState({
                            show:false,
                            ver:true,
                            mensaje: '¿Esta seguro que desea solicitar una devolución de este viaje?'
                        })}>
                            Aceptar
                        </Text>
                    </View>
                </View>
            </View>
          </Modal>
      )
  }

  setmensaje(data){
    this.setState({ver:data, show:data ? this.state.show : data})
  }

  render() {
    if(this.state.visible){
        return(
            <Container>
                <Head name={'Mis Reservas'} navigation={this.props.navigation}/>
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Spinner color={'red'}/>
                </View>
            </Container>
        )
    }
    else{
        return (
          <Container>
            {this.renderModal()}
            <Mensaje 
                visible={this.state.ver} 
                mensaje={this.state.mensaje} 
                setmensaje={this.setmensaje}
                creatDev={this.creatDev}
            />
            <Head name={'Mis Reservas'} navigation={this.props.navigation}/>
            <View style={estilo.content}>
                <Tabs 
                    tabContainerStyle={estilo.tab_cont}
                    tabBarUnderlineStyle={{backgroundColor:'#f7f7f700'}}
                >
                    <Tab 
                        heading='Próximas'
                        activeTabStyle={estilo.active_tab} 
                        tabStyle={estilo.tab}
                        textStyle={estilo.tab_text}
                        activeTextStyle={estilo.tab_text}
                    >
                       <ScrollView>
                            <List
                                dataArray={this.state.listas}
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
                                                        
                                                    </Body>
                                                    <View style={{alignItems:'center'}}>
                                                        <Title style={{color:'gray'}}>RD$ 
                                                            <Text style={{color:'red'}}>
                                                                {data.costo?data.costo.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):''}
                                                            </Text>
                                                        </Title>
                                                        <Subtitle style={{color:'gray'}}>{data.estatus}</Subtitle>
                                                    </View>

                                                </CardItem>
                                            </Card>
                                        )   
                                }}
                            />
                        </ScrollView>
                    </Tab>
                    <Tab 
                        heading='Anteriores'
                        tabStyle={estilo.tab}
                        activeTabStyle={estilo.active_tab}
                        textStyle={estilo.tab_text}
                        activeTextStyle={estilo.tab_text}
                    >
                        <ScrollView>
                            <List
                                dataArray={this.state.terminadas}
                                renderRow={data=>{
                                    return(
                                        <Card transparent>
                                            <CardItem style={[estilo.item, {flexDirection:'column'}]}>
                                                <View style={{height:'auto', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                                                    <Icon
                                                        style={estilo.icon}
                                                        name='contact'
                                                    />
                                                    <Body style={estilo.body}>
                                                        <Title style={estilo.title}>{moment(data.fecha).format('DD MM YYYY')}</Title>
                                                        <Subtitle style={estilo.subtitle}>
                                                        {data.driver&&data.driver!==null&&data.driver.vehiculo!==null?data.driver.vehiculo.tipo+' '+(data.driver.unidad?data.driver.unidad:''):''}                                                        
                                                        </Subtitle>
                                                    </Body>
                                                    <View style={{flexDirection:'row', justifyContent:'space-evenly', width:ancho*0.4}}>
                                                        <View style={{alignItems:'center'}}>
                                                            <Title style={{color:'gray'}}>RD$ 
                                                                <Text style={{color:'red'}}>
                                                                    {data.costo?data.costo.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):''}
                                                                </Text>
                                                            </Title>
                                                            <Subtitle style={{color:'red'}}>{data.estatus}</Subtitle>
                                                        </View>
                                                        <View style={{alignItems:'center', justifyContent:'center'}}>
                                                            <Icon
                                                                style={{fontSize: 35, color: '#676767'}}
                                                                name={data.fav?'star':'star-outline'}
                                                                onPress={()=>this.setFav(data._id, data.fav)}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{justifyContent:'flex-start'}}>
                                                    <Text numberOfLines={3} style={{textAlign:'left'}}><Text style={{color:'red'}}>Salida:</Text> {data.salida}</Text>
                                                    <Text numberOfLines={3} style={{textAlign:'left'}}><Text style={{color:'red'}}>Llegada:</Text> {data.llegada}</Text>
                                                    <Text style={{textAlign:'left'}}><Text style={{color:'red'}}>Duración:</Text> {data.duracion} min</Text>
                                                    <Text style={{textAlign:'left'}}><Text style={{color:'red'}}>Distancia:</Text> {data.distancia}</Text>
                                                </View>
                                                {
                                                    data.tipo === 'Tarjeta' &&
                                                        <TouchableHighlight
                                                            underlayColor={'transparent'}
                                                            onPress={()=>this.setState({show:true, dev:data})}
                                                        >
                                                            <View style={{
                                                                flexDirection:'row', 
                                                                alignItems:'center', 
                                                                borderRadius:10, 
                                                                backgroundColor:'black', 
                                                                left:0,
                                                                width:150,
                                                                justifyContent:'space-around'
                                                            }}>
                                                                <Text style={{color:'white'}}>
                                                                    Devolución
                                                                </Text>
                                                                <Icon
                                                                    name='refresh'
                                                                    style={{color:'white'}}
                                                                />
                                                            </View>
                                                        </TouchableHighlight>
                                                }
                                            </CardItem>
                                        </Card>
                                    )
                                }}
                            />
                        </ScrollView>
                    </Tab>
                </Tabs>
                
            </View>
          </Container>
        );
    }
  }
}

export default withNavigationFocus(MisReservas)

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
    },
    boton:{
        backgroundColor:'black',
        borderRadius:10,
        width:ancho*0.3,
        color:'white',
        textAlign:'center',
        textAlignVertical:'center',
        height:40,
        fontSize:18
    }
   });