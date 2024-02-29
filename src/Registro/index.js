import React from "react";
import { StatusBar,Platform ,StyleSheet, Dimensions, TouchableHighlight, AsyncStorage, Image, KeyboardAvoidingView } from "react-native";
import { Header,CheckBox ,Spinner ,Container,Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Form, Item, Input } from "native-base";
import {createAppContainer, createStackNavigator} from 'react-navigation'
import { ScrollView } from "react-native-gesture-handler";
import Mensaje from '../componentes/Modals/Mensajes'
import store from '../redux/store'
import {createId, createToken, setLocation} from '../redux/actions'
import DateTimePicker from 'react-native-modal-datetime-picker'
import {server} from '../componentes/Api'
import Confirm from '../componentes/Modals/Confirm'
import Cargando from '../componentes/Modals/Cargando'
import moment from 'moment'
import 'moment/locale/es'
import firebase from 'react-native-firebase'
import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'
import Condiciones from "../componentes/Modals/Condiciones";
export default class Registro extends React.Component{

    constructor(){
        super()
        this.state={
            pais:'',
            cca2:'DO',
            codigo:'',
            match:'',
            nombre:'',
            apellido:'',
            fecha:'',
            direccion:'',
            email:'',
            telefono:'',
            pass:'',
            password:'',
            visible:false,
            mensaje: '',
            mostrarmensaje: false,
            confirmResult:null,
            mostrarcargando:false,
            mostrarcargando: false,
            mostrarconfirmar: false,
            telefonovalido: false,
            emailvalido: false,
            registrarse_btn: false,
            confirmar_btn: false,
            cont:30,
            conditions:false,
            showConditions:false,
        }
        this.setmensaje=this.setmensaje.bind(this)
        this.cerrar = this.cerrar.bind(this)
        this.confirmar= this.confirmar.bind(this)
        this.setcodigo = this.setcodigo.bind(this)
        this.onPressFlag=this.onPressFlag.bind(this)
        this.selectCountry=this.selectCountry.bind(this)
        this.cerrarTerminos=this.cerrarTerminos.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState){
        if((nextState.password!==this.state.password &&
            nextState.password===''&&this.state.pass==='')||(
            nextState.pass!==this.state.pass &&
            nextState.pass===''&&this.state.password===''
            )){
            this.setState({
                match:''
            })
            return true
        }

        if((nextState.pass!=='' && 
            this.state.pass!== nextState.pass && 
            nextState.pass.length===1)||(
            this.state.pass!== nextState.pass && 
            nextState.pass.length===this.state.password.length+1)||(
            this.state.pass!== nextState.pass && 
            nextState.pass.length===this.state.password.length-1)
            ){
            this.setState({
                match:'no'
            })
            return true
        }
        if(this.state.pass!==nextState.pass && nextState.pass===this.state.password){
           
            this.setState({
                match:'si'
            })
            return true
        }
        return true
    }

    handleDateTimePicker=date=>{
        this.setState({
            fecha:date
        })
        this.hideDateTimePicker()
    }

    hideDateTimePicker(){
        this.setState({visible:false})
    }

    onPressFlag(){
        this.countryPicker.openModal()
    }

    selectCountry(country){
        this.phone.selectCountry(country.cca2.toLowerCase())
        this.setState({cca2:country.cca2})
    }

    selectDate(){
        return(
            <View>
                <DateTimePicker
                    mode='date'
                    isVisible={this.state.visible}
                    onConfirm={Platform.OS==='ios'?()=>this.handleDateTimePicker():this.handleDateTimePicker}
                    onCancel={Platform.OS==='ios'?()=>this.hideDateTimePicker():this.hideDateTimePicker}
                >
                </DateTimePicker>
            </View>
        )
    }

    limpiar(){
        this.setState({
            match:'',
            nombre:'',
            apellido:'',
            fecha:'',
            direccion:'',
            email:'',
            pass:'',
            password:'',
            visible:'',
            telefono:''
        })
    }

    cerrar() {
        this.setState({mostrarconfirmar: false})
    }

    

    contar(){
        if(this.state.cont>0 && !this.state.confirmResult){
            let num = this.state.cont
            num--
            this.setState({
                cont:num, 
                mensaje: 'Espera mientras verificamos tu número de telefono. '
                +'\n Tiempo restante para pasar a verificación manual '+num.toString()+' segundos'})
            setTimeout(()=>{
                this.contar()
            }
            ,1000)
        }
        else{
            if(!this.state.confirmResult) this.setState({mostrarmensaje:false})
        }
    }

    registrar(){
        if(this.state.nombre===''||
            this.state.apellido===''||
            this.state.email===''||
            this.state.password===''||
            (this.state.direccion === '' && Platform.OS === 'android')||
            this.state.telefono===''){
                this.setmensaje(true)
                this.setState({
                    mensaje:'Debe completar todos los campos'})
            }
        else{
            fetch(server + '/cliente', {
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    nombre:this.state.nombre,
                    apellido:this.state.apellido,
                    email:this.state.email,
                    password:this.state.password,
                    telefono:this.state.telefono,
                    direccion: this.state.direccion
                })
            })
            .then(res=>{
                res=JSON.parse(res._bodyText)
                if(res.message){
                    this.setState({
                        mostrarcargando: false,
                        mostrarmensaje:true,
                        mensaje:'Ya existe un cliente registrado con ese número de teléfono. Intente registrarse con un número distinto '
                    }) 
                }else{
                    this.setState({
                        mostrarcargando: false,
                        mostrarmensaje: true,
                        mensaje:'Se ha registrado exitosamente'
                    })
                    fetch(`${server}/cliente/login`, {
                        method:'POST',
                        headers:{
                            Accept: 'application/json',
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                            telefono:this.state.telefono,
                            password: this.state.password
                        })
                    })
                    .then((response)=>{
                        let data = response._bodyText
                        data = JSON.parse(data)
                        AsyncStorage.setItem('token',data.token)
                        AsyncStorage.setItem('userId',data.id)
                        store.dispatch(createToken(data.token))
                        store.dispatch(createId(data.id))
                        store.dispatch(setLocation('Home'))
                        this.limpiar()
                        this.props.navigation.navigate('Home')
                    })
                    .catch(error=>alert(error))
                }
            })
            .catch(error=>alert(error))
        }
    }

    validarEmail(valor) {
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)){
            this.setState({emailvalido: true, email: valor})
            return true
        } else {
            this.setState({emailvalido: false, email: valor})
            return false
        }
      }
    validarTlf(valor) {
        valor = valor.replace(/[.*+?^${}()|[\]\\]/g, '')
        valor = valor.replace (/-/gi, "");
        if (/^([0-9]{4,5})+z{0}([0-9]{6})$/i.test(valor)){
         this.setState({telefonovalido: true, telefono: valor})
         return true
        } else {
        this.setState({telefonovalido: false, telefono: valor})
        return false
        }
      }
      validartelefono(){
        this.setState({registrarse_btn: true})
        let tlf = ''
        let tl = this.state.telefono.substr(0, 3)
        if(tl === '412' || tl === '414' || tl === '416') {
            tlf = '+58' + this.state.telefono
        }else{
            tlf = '+1' + this.state.telefono
        }
        firebase.auth().signInWithPhoneNumber(tlf)
        .then(confirmResult => {
            this.setState({
                mensaje: 'Se te ha enviado un código de verificación!',
                registrarse_btn:false, 
                confirmResult: confirmResult,
                mostrarmensaje:true, 
            })
        })
        .catch(error => this.setState({registrarse_btn:false, mostrarmensaje:true, mensaje: `Sign In With Phone Number Error: ${error.message}` }));
      }
      confirmar () {
        this.setState({confirmar_btn: true})
        //alert('se ejecuta confirmar')
        const { codigo, confirmResult } = this.state;
        if (confirmResult && codigo.length) {
          confirmResult.confirm(codigo)
            .then((user) => {
                this.setState({confirmar_btn: false, mostrarconfirmar:false});
                this.registrar()
            })
            .catch(error =>{ 
                this.setState({confirmar_btn: false, mostrarmensaje:true, mensaje: `Código incorrecto, por favor verifica y intenta nuevamente` })
            });
        }else{
            this.setState({mostrarmensaje:true, mensaje: `Informacion incompleta` })
        }
      };
    setcodigo(text) {    
        this.setState({codigo: text})
    }
    validartelefono2() {
        if(this.state.nombre===''||
            this.state.apellido===''||
            this.state.email===''||
            (this.state.direccion === '' && Platform.OS === 'android')||
            this.state.password===''){
                this.setmensaje(true)
                this.setState({ 
                    mensaje:'Debe completar todos los campos'})
            }else{
        this.setState({mostrarcargando:true})
            
        let tlf = ''
        if(this.state.telefono== '4123800046' || this.state.telefono== '4145135599') {
            tlf = '+58' + this.state.telefono
        }else{
            tlf = '+1' + this.state.telefono
        }
        firebase.auth()
            .verifyPhoneNumber(tlf)
            .on('state_changed', (phoneAuthSnapshot) => {
                // How you handle these state events is entirely up to your ui flow and whether
                // you need to support both ios and android. In short: not all of them need to
                // be handled - it's entirely up to you, your ui and supported platforms.

                // E.g you could handle android specific events only here, and let the rest fall back
                // to the optionalErrorCb or optionalCompleteCb functions

                switch (phoneAuthSnapshot.state) {
                // ------------------------
                //  IOS AND ANDROID EVENTS
                // ------------------------
                case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                    console.log('code sent');
                    this.contar()
                    this.setState({mostrarcargando:false,mostrarmensaje: true})
                    //this.setState({confirmResult: phoneAuthSnapshot, mostrarconfirmar: true})
                    // on ios this is the final phone auth state event you'd receive
                    // so you'd then ask for user input of the code and build a credential from it
                    // as demonstrated in the `signInWithPhoneNumber` example above
                    break;
                case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                    console.log('verification error');
                    //alert('verification error')
                    this.setState({mostrarcargando:false,mostrarmensaje: true, mensaje: phoneAuthSnapshot.error})
                    console.log(phoneAuthSnapshot.error);
                    break;

                // ---------------------
                // ANDROID ONLY EVENTS
                // ---------------------
                case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                    console.log('auto verify on android timed out');
                    this.setState({mostrarcargando:false})
                    //this.setState({mostrarmensaje: true, mensaje: 'El tiempo de espera se ha agotado'})
                    this.validartelefono()
                    //alert('auto verify on android timed out')
                    // proceed with your manual code input flow, same as you would do in
                    // CODE_SENT if you were on IOS
                    break;
                case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                    // auto verified means the code has also been automatically confirmed as correct/received
                    // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
                    console.log('auto verified on android');
                    this.setState({mostrarcargando:true,mostrarmensaje: true, mensaje: 'Hemos verificado tu número exitosamente'})
                    this.registrar()
                    //alert('auto verify on android timed out')
                    console.log(phoneAuthSnapshot);
                    // Example usage if handling here and not in optionalCompleteCb:
                    // const { verificationId, code } = phoneAuthSnapshot;
                    // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

                    // Do something with your new credential, e.g.:
                    // firebase.auth().signInWithCredential(credential);
                    // firebase.auth().currentUser.linkWithCredential(credential);
                    // etc ...
                    break;
                }
            }, (error) => {
                // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
                // the ERROR case in the above observer then there's no need to handle it here
                console.log(error);
                this.setState({mostrarcargando:false,mostrarmensaje: true, mensaje: error.nativeErrorMessage})
                //alert(JSON.stringify(error))
                // verificationId is attached to error if required
                console.log(error.verificationId);
            },(phoneAuthSnapshot) =>{
                     //this.setState({confirmResult: firebase, mostrarconfirmar: true})
                //alert('se ejecuta esto de una')
                // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
                // depending on the platform. If you've already handled those cases in the observer then
                // there's absolutely no need to handle it here.
                //this.setState({mostrarmensaje: true, mensaje: 'El numero de telefono se ha verificado exitosamente'})
                //this.registrar()
                //this.setState({ registrarse_btn:false, confirmResult: phoneAuthSnapshot, mostrarconfirmar: true, mostrarmensaje:true, mensaje: 'Se te a enviado un codigo de verificacion!' })
                // Platform specific logic:
                // - if this is on IOS then phoneAuthSnapshot.code will always be null
                // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
                //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
                // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
                //   continue with user input logic.
                //alert(JSON.stringify(phoneAuthSnapshot))
                this.setState({mostrarcargando:false})
                console.log(phoneAuthSnapshot);
            });
        }
    }

    setcargando(data) {
        this.setState({mostrarcargando: data})
    }
    validarcampos() {
        if(this.state.nombre!=''&&
        this.state.apellido!=''&&
        this.state.telefono!=''&&
        this.state.email!=''&&
        this.state.password!='' && this.state.match === 'si' && this.state.telefonovalido && this.state.emailvalido){
            if(Platform.OS === 'android'){
                if(this.state.direccion !='') return false
                else return true
            }else return false
        }else{
            return true
        }
    }

    setmensaje(data) {
        this.setState({mostrarmensaje: data})
        if(!data&&this.state.mensaje.includes('Se te ha enviado')){
            this.setState({mostrarconfirmar:true})
        }
    }
    cerrarTerminos(data){
        this.setState({showConditions:data})
    }
    render(){
        return(
            <Container>
            <Cargando visible={this.state.mostrarcargando} setcargando={this.setcargando} mensaje={this.state.mensaje}/>
            <Confirm confirmar_btn={this.state.confirmar_btn} cerrar={this.cerrar} setcodigo={this.setcodigo} confirmar={this.confirmar} visible={this.state.mostrarconfirmar}/>
            <Mensaje visible={this.state.mostrarmensaje} setmensaje={this.setmensaje} mensaje={this.state.mensaje} />
            <Condiciones visible={this.state.showConditions} cerrarTerminos={this.cerrarTerminos}/>
                <KeyboardAvoidingView behavior='padding' style={{flex:1,justifyContent:'center', alignItems:'center'}}
                >
                    <View style={{height:alto*0.1,width:ancho, backgroundColor:'#E84546', alignItems:'center', justifyContent:"center"}}>
                        <Text style={{textAlign:'center', fontSize:25, color:'white'}}>Registrate</Text>
                    </View>
                    <View style={{height:alto*0.1,width:ancho, alignItems:'center', justifyContent:'center'}}>
                        <Image
                            resizeMode= 'contain'
                            style={[estilo.logo,{top:25, backgroundColor:'white', zIndex:20}]}
                            source={require('../assets/images/logo.png')}
                        />
                        <CountryPicker
                            ref={ref=>this.countryPicker=ref}
                            onChange={value=>this.selectCountry(value)}
                            translation='spa'
                            cca2={this.state.cca2}
                        />
                    </View>
                    <ScrollView>
                        <View style={estilo.form}>
                            <View style={this.state.nombre!==''?estilo.item2:estilo.item}>
                                <Icon
                                    name='contact'
                                    style={this.state.nombre!==''?estilo.icono:estilo.icon}
                                />
                                <Input ref='nombre' placeholder='Nombre'
                                    value={this.state.nombre}
                                    onChangeText={text=>{
                                        if(text.split(" ").length<3){
                                            this.setState({nombre:text})
                                        }
                                    }}
                                ></Input>
                            </View>
                            <View style={this.state.apellido!==''?estilo.item2:estilo.item}>
                                <Icon
                                    name='contact'
                                    style={this.state.apellido!==''?estilo.icono:estilo.icon}
                                />
                                <Input ref='apellido' placeholder='Apellido'
                                    value={this.state.apellido}
                                    onChangeText={text=>{
                                        if(text.split(" ").length<4){
                                            this.setState({apellido:text})
                                        }
                                    }}
                                ></Input>
                            </View>
                            {   Platform.OS === 'android' && 
                                <View style={this.state.direccion!==''?estilo.item2:estilo.item}>
                                    <Icon
                                        name='home'
                                        style={this.state.direccion!==''?estilo.icono:estilo.icon}
                                    />
                                    <Input ref='dir' placeholder='Dirección'
                                        value={this.state.direccion}
                                        onChangeText={text=>this.setState({direccion:text})}
                                    ></Input>
                                </View>
                            }   
                            <View style={this.state.email!==''&&this.state.emailvalido?estilo.item2:estilo.item}>
                                <Icon
                                    name='mail'
                                    style={this.state.email!==''&&this.state.emailvalido?estilo.icono:estilo.icon}
                                />
                                <Input ref='mail' placeholder='Correo'
                                    value={this.state.email}
                                    onChangeText={text=>this.validarEmail(text)}
                                ></Input>                        
                            </View>
                            <View style={this.state.telefono!=='' && this.state.telefonovalido?estilo.item2:estilo.item}>
                                <PhoneInput
                                    ref={ref=>this.phone=ref}
                                    onPressFlag={()=>this.onPressFlag()}
                                    style={{paddingLeft:ancho*0.02, width:80}}
                                />
                                <Input ref='telefono' placeholder='Telefono'
                                    value={this.state.telefono}
                                    keyboardType='numeric'
                                    maxLength={10}
                                    onChangeText={text=>{
                                        //this.setState({telefono:text})
                                       this.validarTlf(text)
                                    }}
                                ></Input>                        
                            </View>
                            <View style={this.state.match===''||this.state.match==='no'?estilo.item:estilo.item2}>
                                <Icon
                                    name='lock'
                                    style={this.state.match===''||this.state.match==='no'?estilo.icon:estilo.icono}
                                />
                                <Input ref='password' placeholder='Contraseña'
                                    value={this.state.password}
                                    onChangeText={text=>this.setState({password:text})}
                                ></Input>
                            </View>
                            <View style={this.state.match===''||this.state.match==='no'?estilo.item:estilo.item2}>
                                <Icon
                                    name='lock'
                                    style={this.state.match===''||this.state.match==='no'?estilo.icon:estilo.icono}
                                />
                                <Input ref='pass' placeholder='Confirme su contraseña'
                                    value={this.state.pass}
                                    onChangeText={text=>this.setState({pass:text})}
                                ></Input>
                            </View>
                            <View style={!this.state.conditions?[estilo.item,{justifyContent:'center'}]:[estilo.item2,{justifyContent:'center'}]}>
                                <TouchableHighlight underlayColor='transparent'
                                    onPress={()=>this.setState({showConditions:true})}
                                >
                                    <Text style={{textAlign:'center', color:!this.state.conditions?'#E84546':'green', fontWeight:'bold'}}>Acepto los Términos y Condiciones</Text>
                                </TouchableHighlight>
                                <CheckBox
                                    color={this.state.conditions?'green':'red'}
                                    checked={this.state.conditions}
                                    onPress={()=>this.setState({conditions:!this.state.conditions})}
                                />
                            </View>
                            <View style={estilo.botones}>
                                <Button
                                    style={{width:ancho*0.35, justifyContent:'center'}}
                                    onPress={()=>{
                                        this.limpiar()
                                        this.props.navigation.navigate('Login')}}
                                    rounded
                                    danger
                                >
                                    <Text style={{textAlign:'center', justifyContent:'center'}}>Regresar</Text>
                                </Button>
                                <Button
                                    onPress={()=>{
                                        if(this.state.conditions){
                                            if(Platform.OS==='ios'){
                                                this.validartelefono()
                                            }else{
                                                this.validartelefono2()
                                            }
                                        }else{
                                            this.setState({mensaje:'Debe aceptar los términos y condiciones', mostrarmensaje:true})
                                        }
                                    }}
                                    style={this.state.registrarse_btn?estilo.btn_cargando:estilo.btn}
                                    rounded
                                    danger
                                    disabled={this.state.registrarse_btn || this.validarcampos() || store.getState().conexion!=='conectado'? true:false}
                                >
                                    <Spinner color='#fff' style={this.state.registrarse_btn?estilo.cargando:estilo.nocargando}/>
                                    <Text style={{textAlign:'center'}}>Registrarse</Text>
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Container>
        )
    }
}

const alto =  Dimensions.get('window').height
const ancho = Dimensions.get('window').width

 const estilo=StyleSheet.create({
    btn:{
        width:ancho*0.40,
        justifyContent:'center'
    },
    btn_cargando: {
        width:ancho*0.40
    },
    cargando:{
        marginLeft: 20,
        width:20,
        height: 20,
        fontSize: 10
    },
    nocargando:{
        display: 'none'
    },
    logo:{
        width:ancho*0.7,
        height:alto*0.1
    },
    botones:{
        marginTop:'5%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        width:ancho*0.9
    },  
    form:{
        width:ancho*0.95,
        height:alto*0.90,
        marginTop:'1%',
        alignItems:'center'
    },
    item:{
        flexDirection:'row',
        width:ancho*0.95,
        height:alto*0.06,
        borderWidth:1,
        borderRadius:25,
        borderColor:'red',
        marginTop:alto*0.02,
        justifyContent:'flex-start',
        alignItems:'center'
    },
    item2:{
        marginTop:alto*0.02,
        borderWidth:1,
        borderColor:'green', 
        flexDirection:'row', 
        width:ancho*0.95,
        height:alto*0.06,
        borderRadius:25,
        alignItems:'center',
        justifyContent:'flex-start'
    },
    icon:{
        paddingLeft:ancho*0.02,
        color:'#E84546'
    },
    icono:{
        paddingLeft:ancho*0.02,
        color:'green'
    },
 })