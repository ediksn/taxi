import React, { Component} from 'react'
import { View, Platform,StyleSheet, Dimensions, Image } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from "native-base";
import {server,sock} from '../Api'
import store from '../../redux/store'
export default class Viaje extends Component{
    constructor(props){
        super(props)
        this.state={
            chofer:props.chofer
        }
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
                            Viaje en progreso
                        </Text>
                    </View> 
                    <View style={[style.content,{height:'auto'}]}>
                        {this.detalles()}
                        <View style={[style.ancho,{justifyContent:'center', alignItems:'center', width:ancho*0.25}]}>
                            {this.renderImagen()}
                        </View>
                        <View style={[style.ancho,{marginLeft:10}]}>
                        <Text numberOfLines={4} style={{width:'100%'}}>
                                {this.props.chofer.nombre+' '+this.props.chofer.apellido}
                            </Text>
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
                    {/*<View style={style.botones}>
                     <Button 
                        style={style.btn_llamar}
                        onPress={()=>{this.terminar()}}
                    >
                        <Text>Finalizar</Text>
                     </Button>
                        </View>*/}
                </Card>
            </View>
        )
    }
}

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const style = StyleSheet.create({
    btn_cancelar:{
        backgroundColor: '#676767',
        borderRadius: 25,
        marginBottom: 20,
        width:ancho / 2.5
    },
    btn_llamar:{
        backgroundColor: '#E84546',
        borderRadius: 25,
        marginBottom: 20,
        justifyContent:'center',
        width:ancho / 2.5
    },
    botones: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    estrellas: {
        flexDirection: 'row'
    },
    ancho: {
        width: ancho / 3
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
        width:ancho,
        alignItems:'center',
        justifyContent:'center'
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
        width:ancho  
    },
    fondo:{
        marginBottom: -1,
        backgroundColor:'#FFFFFF',
        height: 200,
        width:ancho + 1 ,
        alignItems:'center',
        justifyContent:'center'
    },
    content:{
        flex: 1,
        width: ancho*0.9,
        alignItems: 'center',
        justifyContent: 'center',
        height:50,
        paddingHorizontal: 20,
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 5,
        backgroundColor: '#fff'
    },
    icon:{
        fontSize: 80, 
        color: '#676767'
    },
    img:{
        borderRadius:Platform.select({ios:40,android:80}),
        width:80,
        height:80
    }
})