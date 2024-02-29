import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, List, CheckBox } from "native-base";
import store from '../../redux/store'
import {server} from '../Api'
export default class Extra extends Component{
    constructor(){
        super()
        this.state={
            extras:[],
            ext: [],
            size:0,
            cadena:''
        }
    }

    shouldComponentUpdate(nextProps,nextState){
        if(this.state.cadena!==nextState.cadena){
            return true
        }
        return true
    }

    componentDidUpdate(prevProps){
        if(this.props.visible!==prevProps.visible&&this.props.visible===true){
            this.getExtras()
            if(this.props.extras.length<1){
                for(let i = 0; i<this.state.extras.length;i++){
                    this.setState({['check'+i]:false})
                }
            }
        }
    }

    componentDidMount(){
        this.getExtras()
    }

    getExtras(){
        if(this.props.conexion==='conectado'){
            fetch(`${server}/extra`,{
                method:'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
                }
            })
            .then(response=>{
                let data = JSON.parse(response._bodyInit)
                this.setState({
                    extras:data
                })
            })
            .catch(error=>{
                alert(error)
            })
        }
    }

    addExt(){
        this.props.addExt(this.state.ext)
        this.props.cerrarExtras()
    }

    addOpcion(data){
        let arr = this.state.ext
        let cent= false
        for(let i=0;i<arr.length;i++){
            if(data===arr[i]){
                arr.splice(i,1)
                cent=true
                this.setState({
                    cadena:this.state.cadena.replace(data,'')
                })
            }
        }
        if(!cent){
            arr.push(data)
            this.setState({
                cadena:this.state.cadena+data
            })
        }
        this.setState({
            ext:arr
        })
    }


    renderExtras(){
        let arr=[]
        for(let i =0;i<this.state.extras.length;i++){
            arr.push(
                <View key={'e'+i} style={estilo.razon}>
                    <Text>{this.state.extras[i].nombre}</Text>
                    <CheckBox
                        color='red'
                        style={{marginRight:10}}
                        checked={this.state['check'+i]}
                        onPress={()=>{
                            if(this.state['check'+i]===true){
                                this.setState({['check'+i]:false})
                            }
                            else{
                                this.setState({['check'+i]:true})
                            }
                            this.addOpcion(this.state.extras[i].nombre)
                        }} 
                    />  
                </View>
            )
        }
        return arr
    }

    render(){
        return(
        <Modal
          visible={this.props.visible}
          transparent={true}
        >
          <View style={{
            flex:1,
            flexDirection:'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'#000000c2'}}>
            <View 
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor:'#fff',
                paddingBottom: 20,
                borderRadius: 25,
                height:'auto',
                width:Dimensions.get('window').width - 40
              }}
            >
                <View style={estilo.titulo}>
                    <Icon
                        name='list'
                        style={{color:'white'}}
                    />
                    <Text style={estilo.text}>
                     Opciones
                    </Text>
                </View>
                <View style={{justifyContent:'center'}}>
                    <View style={{height:'auto'}}>
                        {this.renderExtras()}
                    </View>
                 <View style={{ 
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent:'space-around',
                        marginTop: 20,
                        height:20,
                        width:Dimensions.get('window').width*0.7}}>
                    <Button 
                        onPress={()=>this.props.cerrarExtras()}
                        rounded
                        style={estilo.boton}>
                        <Text style={{color:'white', textAlign:'center'}}>Cancelar</Text>
                    </Button>
                    <Button
                        onPress={()=>this.addExt()} 
                        rounded
                        style={estilo.boton}>
                            <Text style={{color:'white', textAlign:'center'}}>OK</Text>
                    </Button>
                </View>   
                </View>
            </View>
          </View>
        </Modal>
        )
    }
}

const ancho = Dimensions.get('window').width
const alto = Dimensions.get('window').height

const estilo = StyleSheet.create({
  
    text: {
        color:'white'
    },
    titulo:{
        width:Dimensions.get('window').width - 40,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#E84546',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection:'row'
    },
    razon:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:Dimensions.get('window').height*0.02,
        width: Dimensions.get('window').width*0.7
    },
    boton:{
        backgroundColor:'#676767',
        justifyContent:'center', 
        marginTop:1,
        height:30
    },
    icono:{
        color:'black',
        fontSize:30
    },
    icon:{
        color:'green',
        fontSize:30
    }
})