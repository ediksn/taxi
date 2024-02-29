import React, { Component} from 'react'
import { View, StyleSheet, Dimensions, Linking, Image, TouchableHighlight ,Platform} from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from "native-base";
import {server,sock} from '../Api'
import store from '../../redux/store'
export default class Conductor extends Component{
    constructor(props){
        super(props)
        this.state={
            chofer:this.props.chofer
        }
    }
   
    llamar(){
        Linking.openURL(`tel:${this.props.chofer.telefono}`)
    }

    extrellas(){
        let val = this.props.chofer.valor&&this.props.chofer.viajes?Math.round(this.props.chofer.valor / this.props.chofer.viajes):0
        let arr=[]
        for(let i=0;i<5;i++){
            if(i<=val){
                arr.push(<Icon key={'star'+i} style={{fontSize: 20, color: '#E84546'}} name='star' />)
            }
            else{
                arr.push(<Icon key={'star'+i} style={{fontSize: 20, color: '#676767'}} name='star-outline' />)
            }
        }
        return arr
    }

    detalles(){
        if(this.props.chofer.vehiculo&&this.props.chofer.vehiculo!==null){
            return(
                <View style={style.ancho}>
                    <Text>Marca: {this.props.chofer.vehiculo.marca}</Text>
                    <Text>Modelo: {this.props.chofer.vehiculo.modelo}</Text>
                    <Text>Placa: {this.props.chofer.vehiculo.placa}</Text>
                    <Text>Color: {this.props.chofer.vehiculo.color}</Text>
                    <Text>Tipo: {this.props.chofer.vehiculo.tipo}</Text>
                </View>
            )
        }
        else{
            return(null)
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
        if(this.props.chofer.imagen===null){
            return(
                <Icon style={style.icon} name='contact' />
            )
        }
        else{
            return(
                <Image 
                    style={style.img} 
                    source={this.replaceUri(Platform.OS==='ios'? {...this.props.chofer.imagen}:this.props.chofer.imagen)} 
                />
            )
        }
      }

    render(){
        return(
            <View style={style.view}>
                <Card style={style.fondo}>
                    <View style={style.titulo}>
                        <Text style={style.text}>
                        {this.props.chofer.nombre} {this.props.chofer.apellido}
                        </Text>
                    </View> 
                    <View style={[style.content,{height:'auto'}]}>
                        {this.detalles()}
                        <View style={style.ancho}>
                            {this.renderImagen()}
                        </View>
                        <View style={style.ancho}>
                            <View style={style.estrellas}>
                                {this.extrellas()}
                            </View>
                            {this.props.chofer.unidad?
                                <View>
                                    <Text>Unidad: </Text>
                                    <Text>{this.props.chofer.unidad}</Text>
                                </View>:
                                null
                            }
                        </View>
                    </View>
                    <View style={style.botones}>
                        <TouchableHighlight underlayColor={'transparent'} onPress={()=>{
                            this.props.confirmCancelar()}}>
                            <Button style={style.btn_cancelar} onPress={()=>{
                            this.props.confirmCancelar()
                            }}>
                                <Icon style={{color: '#fff'}} name='close' />
                                <Text>Cancelar</Text>
                            </Button>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'transparent'} onPress={()=>this.llamar()}>
                            <Button iconLeft style={style.btn_llamar} onPress={()=>this.llamar()}>
                                <Icon style={{ color: '#fff',}} name='call' />
                                <Text>Llamar</Text>
                            </Button>
                        </TouchableHighlight>
                    </View>
                </Card>
            </View>
        )
    }
}

const style = StyleSheet.create({
    btn_cancelar:{
        justifyContent:'center',
        backgroundColor: '#676767',
        borderRadius: 25,
        marginBottom: 20,
        width:Dimensions.get('window').width / 2.5
    },
    btn_llamar:{
        justifyContent:'center',
        backgroundColor: '#E84546',
        borderRadius: 25,
        marginBottom: 20,
        width:Dimensions.get('window').width / 2.5
    },
    botones: {
        marginTop:5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    estrellas: {
        flexDirection: 'row'
    },
    ancho: {
        width: Dimensions.get('window').width / 3
    }, 
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
        margin: 0,
        marginLeft: -5,
        width:Dimensions.get('window').width
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
        height: 220,
        width:Dimensions.get('window').width + 1 
    },
    content:{
        flex: 1,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center',
        height:100,
        paddingHorizontal: 20,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: '#fff'
    },
    icon:{
        fontSize: 80, 
        color: '#676767'
    },
    img:{
        borderRadius:Platform.select({ios:40, android:80}),
        width:80,
        height:80
    }
})