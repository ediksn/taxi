import React from "react";
import {  StyleSheet, Dimensions,Image,Platform} from "react-native";
import { Container, Spinner, Icon, Content,Text, View} from "native-base";
import {withNavigationFocus} from 'react-navigation'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {server} from '../componentes/Api'
import { ScrollView } from "react-native-gesture-handler";
import 'moment/locale/es'
import Mensaje from "../componentes/Modals/Mensajes.js";
import Cargando from "../componentes/Modals/Cargando";
import Tarjeta from "../componentes/Modals/Tarjeta.js";
class Cards extends React.Component {
  constructor(){
    super()
    this.state={
      location:'Favoritos',
      tarjetas:[],
      visible:true,
      show:false,
      loading:false,
      card:false,
      mensaje:'',
      cd:'',
      index:null
    }
    this.setmensaje=this.setmensaje.bind(this)
    this.cerrarTarjeta=this.cerrarTarjeta.bind(this)
    this.getTarjetas=this.getTarjetas.bind(this)
    this.eliminar=this.eliminar.bind(this)
  }

    componentDidMount() {
        this.getTarjetas()
    }

  componentDidUpdate(prevProps,prevState){
    if(this.props.isFocused!==prevProps.isFocused){
        this.getTarjetas()
    }
    if(this.state.card!==prevState.card){
        this.getTarjetas()
    }
  }   

  getTarjetas(){
    if(store.getState().conexion==='conectado'){
        this.setState({visible:true})
        fetch(`${server}/cliente/${store.getState().id_user}`,{
            method:'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            }
        })
        .then(res=>{
            let data = JSON.parse(res._bodyInit)
            this.setState({tarjetas:data.tarjetas,visible:false})
        })
        .catch(error=>this.setState({visible:false},alert(error)))
    }
  }

    seleccionar(i=null){
        if(store.getState().conexion==='conectado'){
            if(i!==null){
                let tarjetas=this.state.tarjetas
                tarjetas.splice(i,1)
                this.setState({tarjetas:tarjetas})
            }
            fetch(`${server}/cliente/`, {
                method:'PUT',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+store.getState().token.toString()
                },
                body:JSON.stringify({
                    _id:store.getState().id_user,
                    tarjetas:this.state.tarjetas
                })
            })
            .then(res=>{
                this.getTarjetas()
            })
            .catch(error=>alert(error))
        }
    }

    eliminar(){
        this.setState({loading:true})
        if(store.getState().conexion==='conectado'){
            fetch(`${server}/cliente/tarjeta`, {
                method:'PUT',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+store.getState().token.toString()
                },
                body:JSON.stringify({
                    _id:store.getState().id_user,
                    tarjeta:this.state.tarjetas[this.state.index]
                })
            })
            .then(res=>{
                let data = JSON.parse(res._bodyInit)
                if(data.error){
                    this.setState({
                        loading:false,
                        show:true,
                        mensaje:data.error
                    })
                }else{
                    this.setState({
                        loading:false,
                        show:true,
                        mensaje:data.message
                    })
                    this.getTarjetas()
                }
            })
            .catch(error=>alert(error))
        }
    }

  renderImage(tipo){
    if(tipo==='Visa'){
        return(
            <Image
                source={require('../assets/images/visa.png')}
                resizeMode='contain'
                style={{height:40, width:65}}
            />
        )
    }else if(tipo==='Master Card'){
        return(
            <Image
                source={require('../assets/images/mastercard.jpeg')}
                resizeMode='contain'
                style={{height:40, width:65}}
            />
        )
    }else{
        return(
            <Image
                source={require('../assets/images/american_express.png')}
                resizeMode='contain'
                style={{height:40, width:60}}
            />
        )
    }
}

  showTarjetas(){
    let arr=[]
    this.state.tarjetas.forEach((el,i)=>{
        arr.push(
            <View style={estilo.list} key={'list'+i}>
                <Text style={{fontSize:20}}>...{el.numero.toString()}</Text>
                {this.renderImage(el.tipo)}
                <View style={{flexDirection:'row', justifyContent:'space-between', width:60}}>
                    <Icon
                        name={el.default?
                            'checkmark-circle':'checkmark-circle-outline'
                        }
                        onPress={async()=>{
                            let tarjetas=[...this.state.tarjetas].map((ele,id)=>{
                                if(i===id) return ele={...ele,default:true}
                                else return ele={...ele,default:false}
                            })
                            await this.setState({cd:el.tipo, tarjetas:tarjetas})
                            this.seleccionar()
                        }}
                        style={el.default?
                            {color:'green'}:{color:'black'}}
                    />
                    <Icon
                        name={Platform.select({ios:'close-circle-outline',android:'close-circle'})}
                        onPress={()=>{
                            this.setState({show:true,mensaje:'Esta seguro que desea eliminar esta tarjeta?', index:i})
                        }}
                    />
                </View>
            </View>
        )
    })
    return arr
  }

  cerrarTarjeta(data){
    this.setState({card:data})
  }

  setmensaje(data){
    this.setState({show:data})
  }

  render() {
    if(this.state.visible){
        return(
            <Container>
                <Head name={'Tarjetas'} navigation={this.props.navigation}/>
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Spinner color={'red'}/>
                </View>
            </Container>
        )
    }
    else{
        return (
          <Container>
            <Mensaje 
                mensaje={this.state.mensaje} 
                visible={this.state.show} 
                setmensaje={this.setmensaje} 
                eliminar={this.eliminar}
            />
            <Cargando visible={this.state.loading}/>
            <Tarjeta visible={this.state.card} cerrarTarjeta={this.cerrarTarjeta} getTarjetas={this.getTarjetas}/>
            <Head name={'Tarjetas'} navigation={this.props.navigation} cerrarTarjeta={this.cerrarTarjeta}/>
            <View style={estilo.content}>
                <Content 
                    style={{backgroundColor:'#e9e9e9', borderRadius:10, width:ancho}}
                    contentContainerStyle={{justifyContent:'center',marginTop:20}}
                >
                    <ScrollView>
                       {this.showTarjetas()}
                    </ScrollView>
                </Content>
            </View>
          </Container>
        );
    }
  }
}

export default withNavigationFocus(Cards)

const alto=Dimensions.get('window').height
const ancho =Dimensions.get('window').width

const estilo = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        marginBottom:0,
        marginHorizontal: 0,
        marginVertical: 0,
        width:ancho,
        height:alto,
        justifyContent:'center',
        alignItems:'center'
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
    list:{
        borderBottomColor:'#dfe2e5',
        borderTopColor:'#dfe2e5',
        borderBottomWidth:1,
        borderTopWidth:1,
        width:ancho,
        height:65,
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
        backgroundColor:'#d0d0d0'
    }
   });