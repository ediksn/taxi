import React, { Component} from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from "native-base";
export default class Confirmacion extends Component{ 
    render(){
        return(
            <View style={style.view}>
                <Card style={style.fondo}>
                    <View style={style.titulo}>
                        <Text style={style.text}>
                            Ultimos 2 viajes
                        </Text>
                    </View> 
                    <View style={style.content}>
                        <View>
                            <Text>Prueba</Text>
                            <Text>TAXI</Text>
                        </View>
                        <View >
                            <Text style={style.costo}>RD$<Text style={style.precio}> 150.00</Text></Text>
                            <Text style={style.texto}>Cantidad del Viaje</Text>
                        </View>
                    </View>
                    <View style={style.content}>
                        <View>
                            <Text>Prueba</Text>
                            <Text>TAXI</Text>
                        </View>
                        <View >
                            <Text style={style.costo}>RD$<Text style={style.precio}> 150.00</Text></Text>
                            <Text style={style.texto}>Cantidad del Viaje</Text>
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