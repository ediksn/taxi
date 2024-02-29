import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet, AsyncStorage} from "react-native";
import { Icon, Button,Text} from "native-base";
import store from '../../redux/store'
import {createToken, createId, setLocation} from '../../redux/actions'
import {server} from '../Api'
import NavigationService from '../../../NavigationService/NavigationService'
import { ScrollView } from 'react-native-gesture-handler';
export default class Devoluciones extends Component{
    constructor(){
        super()
    }

    botones(){
        return(
            <View style={{marginLeft:120}}>
                <Button
                    style={{marginBottom:alto*0.01}} 
                    onPress={()=>this.props.cerrarDevo(false)}
                    rounded
                    danger>
                        <Text style={{color:'white', textAlign:'center'}}>Cerrar</Text>
                </Button>
            </View>
        )
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
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor:'#fff',
                borderRadius: 15,
                height:'auto',
                width:Dimensions.get('window').width*0.95
              }}
            >
                <ScrollView>
                <View style={{justifyContent:"center", width:'100%'}}>
                    <View style={estilo.razon}>
                        <View style={{height:60}}></View>
                        <Text style={{fontSize:15, textAlign:'justify'}}>
                        {`                            Política de Devolución
 
Los siguientes términos se aplican para todos los servicios reservados a través de la web. 
Esta política podrá cambiar sin necesidad de previo aviso. Appolo.srl. podrá hacer las devoluciones siempre que se cumplan con todas y cada una de las condiciones que se establecen en esta política.
Devolución. El cliente podrá solicitar la devolución de su pago realizado a Appolo.srl.  
siempre y cuando se cumplan las normas establecidas en la política de cancelación.
                         
                        Politica de Cancelación
                        
Una reserva puede ser cancelada si la fecha de cancelación se produce con más de 24 horas de antelación a la fecha del traslado o servicio contratado.
La reserva se tiene que cancelar obligatoriamente a través del formulario de devoluciones de nuestra web que se encuentra al final de este documento, 
indicando el número de la reserva. Si el pago se efectuó a través de tarjeta de crédito o débito, 
el reembolso del cargo se hará a la misma tarjeta de crédito o débito con la que se realizó el pago, 
este trámite puede tardar hasta 30 días hábiles según las políticas de los bancos emisores de Tarjetas. 
Si la cancelación se produce con menos de 24 horas de antelación a la fecha del traslado o servicio reservado, 
no se efectuará ningún reembolso.`}
                        </Text>
                        <View style={{height:60}}></View>
                    </View>
                </View>
                {this.botones()}
                </ScrollView>
            </View>
          </View>
        </Modal>
        )
    }
}

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

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
        justifyContent:'center',
        alignItems:'center',
        width:ancho*0.88
    },
    boton_1:{
        marginTop:1,
        height:30,
        width:Dimensions.get('window').width*0.3,
        backgroundColor:'#676767'
    },
    boton_2:{
        marginTop:1,
        height:30,
        justifyContent:'center',
        width:Dimensions.get('window').width*0.3
    },
    text_env:{

    },
    botones:{
        flexDirection:'row', 
        justifyContent:'center', 
        width:Dimensions.get('window').width*0.7
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