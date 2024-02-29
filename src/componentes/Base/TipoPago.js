import React, { Component} from 'react'
import { View, StyleSheet, Dimensions, Picker } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, List } from "native-base";
import {server} from '../Api/index'
import store from '../../redux/store'
export default class Tipo extends Component{

    constructor(){
        super()
        this.state={
            tipos: [],
            selet:''
        }
    }
    
    componentDidMount(){
        this.getTipos()
    }

    getTipos(){
        fetch(`${server}/tipo_pago`,{
            method:'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            }
        })
        .then(response=>{
            let data = JSON.parse(response._bodyInit)
            this.setState({tipos:data})
        })
        .catch(error=>{
            alert(error)
        })
    }

    render(){
        return(
            <View style={style.view}>
                <Card style={style.fondo}>
                    <View style={style.titulo}>
                        <Text style={style.text}>
                            Seleccione el metodo de pago 
                        </Text>
                    </View> 
                    <View style={{alignSelf:'center', justifyContent:'center'}}>
                        <View style={{flex:1}}>   
                            <Picker 
                                onValueChange={(val, index)=>this.props.addTipo(val)}>
                                />
                            </Picker>
                        </View>
                    </View>
                </Card>
            </View>
        )
    }
}

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
    adres:{
        alignItems:'center', 
        justifyContent:'center', 
        bottom:5,
        height: Dimensions.get('window').height*0.1 
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
        height: 170,
        width:Dimensions.get('window').width + 1
    },
    content:{
        flex: 1,
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
        backgroundColor: '#D6D6D6'
    }
})