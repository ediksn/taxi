import React, { Component } from "react";
import HomeScreen from "./HomeScreen.js";
import SideBar from "../componentes/SideBar/SideBar";
import MisReservas from '../MisReservas/MisReservas'
import Favoritos from '../Favoritos/Favoritos'
import Configuracion from '../Configuracion/Configuracion'
import Acerca from '../Acerca/Acerca'
import Billetera from '../Billetera/Billetera'
import Cards from '../Tarjetas/Cards'
import { createDrawerNavigator, createAppContainer } from "react-navigation";
const HomeScreenRouter = createDrawerNavigator(
  {
    Home: { screen: HomeScreen },
    'Mis Reservas' : { screen: MisReservas},
    'Favoritos':{screen:Favoritos},
    'Configuraciones' :{ screen: Configuracion},
    'Acerca' : {screen:Acerca},
    'Billetera': {screen: Billetera},
    'Tarjeta':{screen:Cards}
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);
const AppContainer = createAppContainer(HomeScreenRouter);
export default AppContainer;