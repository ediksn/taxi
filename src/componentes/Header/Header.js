import React, { Component} from 'react'
import { View, Platform,StyleSheet, Dimensions, TouchableHighlight } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from "native-base";
import store from '../../redux/store'
export default class Head extends Component{ 
    mostrar(){
        switch(this.props.name){
            case 'Mis Reservas':
                return(
                    <View >
                        <Header 
                            transparent
                            style={estilo.head}
                        >
                            <View style={{alignSelf:'center', marginLeft:-15}}>
                                    <Button
                                        style={{alignSelf:'center'}}
                                        transparent
                                        onPress={() => this.props.navigation.openDrawer()}>
                                        <Icon 
                                            name="menu"
                                            style={{
                                                zIndex: 200,
                                                color:'white',
                                                fontSize:30
                                            }}
                                        />
                                    </Button>
                            </View>
                            <View style={estilo.body}>
                                <Title style={{fontSize:25,color:'white',textAlign:'center'}}>{this.props.name}</Title>
                            </View>
                        </Header>
                    </View>
                )
            case 'Favoritos':
                return(
                    <View>
                        <Header 
                            transparent
                            style={estilo.head_2}
                        >
                            <View 
                                style={{alignSelf:'center', marginLeft:-15}}
                            >
                                <Button
                                    style={{alignSelf:'center'}}
                                    transparent
                                    onPress={() => this.props.navigation.openDrawer()}>
                                    <Icon 
                                        name="menu"
                                        style={{
                                            zIndex: 200,
                                            color:'white',
                                            fontSize:30
                                        }}
                                    />
                                </Button>
                            </View>
                            <View style={estilo.body}>
                                <Title style={{fontSize:25,color:'white',textAlign:'center'}}>{this.props.name}</Title>
                            </View>
                        </Header>
                    </View>
                )
            case 'Configuraciones':
            return(
                <View>
                        <Header 
                            transparent
                            style={estilo.head_2}
                        >
                            <View 
                                style={{alignSelf:'center', marginLeft:-15}}
                            >
                                <Button
                                    style={{alignSelf:'center'}}
                                    transparent
                                    onPress={() => this.props.navigation.openDrawer()}>
                                    <Icon 
                                        name="menu"
                                        style={{
                                            zIndex: 200,
                                            color:'white',
                                            fontSize:30
                                        }}
                                    />
                                </Button>
                            </View>
                            <View style={estilo.body}>
                                <Title style={{fontSize:25,color:'white',textAlign:'center'}}>{this.props.name}</Title>
                            </View>
                        </Header>
                    </View>
            )
            case 'Acerca':
            return(
                <View>
                <Header 
                    transparent
                    style={estilo.head_2}
                >
                    <View 
                        style={{alignSelf:'center', marginLeft:-15}}
                    >
                        <Button
                            style={{alignSelf:'center'}}
                            transparent
                            onPress={() => this.props.navigation.openDrawer()}>
                            <Icon 
                                name="menu"
                                style={{
                                    zIndex: 200,
                                    color:'white',
                                    fontSize:30
                                }}
                            />
                        </Button>
                    </View>
                    <View style={estilo.body}>
                        <Title style={{fontSize:25,color:'white',textAlign:'center'}}>{this.props.name}</Title>
                    </View>
                </Header>
            </View>
            )
            case 'Invitar amigos':
            return(
                <View>
                    <Header 
                        transparent
                        style={estilo.head_2}
                    >
                        <View 
                            style={{alignSelf:'center', marginLeft:-15}}
                        >
                            <Button
                                style={{alignSelf:'center'}}
                                transparent
                                onPress={() => this.props.navigation.openDrawer()}>
                                <Icon 
                                    name="menu"
                                    style={{
                                        zIndex: 200,
                                        color:'white',
                                        fontSize:30
                                    }}
                                />
                            </Button>
                        </View>
                        <View style={estilo.body}>
                            <Title style={{fontSize:25,color:'white',textAlign:'center'}}>{this.props.name}</Title>
                        </View>
                    </Header>
                </View>
            )
            case 'Billetera':
            return(
                <View>
                    <Header 
                        transparent
                        style={estilo.head_2}
                    >
                        <View 
                            style={{alignSelf:'center', marginLeft:-15}}
                        >
                            <Button
                                style={{alignSelf:'center'}}
                                transparent
                                onPress={() => this.props.navigation.openDrawer()}>
                                <Icon 
                                    name="menu"
                                    style={{
                                        zIndex: 200,
                                        color:'white',
                                        fontSize:30
                                    }}
                                />
                            </Button>
                        </View>
                        <View style={estilo.body}>
                            <Title style={{fontSize:25,color:'white',textAlign:'center'}}>{this.props.name}</Title>
                        </View>
                    </Header>
                </View>
            )
            case 'Perfil':
            return(
                <View>
                    <Header 
                        transparent
                        style={estilo.head_2}
                    >
                        <View 
                            style={{alignSelf:'center', marginLeft:-15}}
                        >
                            <Button
                                style={{alignSelf:'center'}}
                                transparent
                                onPress={() => this.props.navigation.openDrawer()}>
                                <Icon 
                                    name="menu"
                                    style={{
                                        zIndex: 200,
                                        color:'white',
                                        fontSize:30
                                    }}
                                />
                            </Button>
                        </View>
                        <View style={estilo.body}>
                            <Title style={{fontSize:25,color:'white',textAlign:'center'}}>{this.props.name}</Title>
                        </View>
                    </Header>
                </View>
            )
            case 'Tarjetas':
            return(
                <View>
                    <Header 
                        transparent
                        style={estilo.head_2}
                    >
                        <View 
                            style={{alignSelf:'center', marginLeft:-15}}
                        >
                            <Button
                                style={{alignSelf:'center'}}
                                transparent
                                onPress={() => this.props.navigation.openDrawer()}>
                                <Icon 
                                    name="menu"
                                    style={{
                                        zIndex: 200,
                                        color:'white',
                                        fontSize:30
                                    }}
                                />
                            </Button>
                        </View>
                        <View style={estilo.body}>
                            <Title style={{fontSize:25,color:'white',textAlign:'center'}}>{this.props.name}</Title>
                        </View>
                        <View style={{alignSelf:'center'}}>
                            <Button
                                transparent
                                style={{alignSelf:'center'}}
                                onPress={()=>this.props.cerrarTarjeta(true)}
                            >
                                <Icon
                                    name='add'
                                    style={{
                                        zIndex: 200,
                                        color:'white',
                                        fontSize:30
                                    }}
                                />
                            </Button>
                        </View>
                    </Header>
                </View>
            )
            case'Home':
            return(
                <View>
                    <Header
                        transparent
                        style={estilo.hom}
                    >
                    </Header>
                </View>
            )
            case'Notificaciones':
            return(
                <View>
                    <Header transparent style={estilo.head_2}>
                        <Left>
                            <TouchableHighlight 
                                underlayColor={'transparent'}
                                onPress={() => this.props.navigation.openDrawer()}
                            >
                                <Icon
                                    name='menu'
                                    style={{color:'white'}}
                                    onPress={() => this.props.navigation.openDrawer()}
                                />
                            </TouchableHighlight>
                        </Left>
                        <Body style={{marginLeft:Platform.select({ios:-350,android:ancho*0.12, backgroundColor:'black'})}}>
                            <Title style={{fontSize:25,color:'white',textAlign:'center'}}>{this.props.name}</Title>
                        </Body>
                    </Header>
                </View>
                )
        }
    }
    render(){
        return(
            this.mostrar()
        )
    }
}

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const estilo = StyleSheet.create({
    head:{
        backgroundColor:'#E84546',  
        justifyContent:'flex-start', 
        alignItems:'center',
        height:alto*0.15
    },
    body:{
        marginLeft:-(ancho*0.08),
        justifyContent:'flex-start', 
        alignItems:'center', 
        width:ancho*0.9},
    head_2:{
        backgroundColor:'#E84546',  
        justifyContent:'space-around', 
        alignItems:'center',
        height:alto*0.15
    },
    hom:{
        backgroundColor:'#fff',  
        justifyContent:'space-around', 
        alignItems:'center',
        height:alto*0.15
    },
})