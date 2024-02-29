import React,{Component} from 'react'

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

export default class AutoComplete extends Component{
    render(){
        return(
            <GooglePlacesAutocomplete
                  placeholder='Dirección a buscar 2'
                  minLength={2}
                  autoFocus={true}
                  returnKeyType={'default'}
                  fetchDetails={true}
                  listViewDisplayed='auto'
                  renderDescription={row => row.description}
                  nearbyPlacesAPI='GooglePlaceSearch'
                  onPress={(data, details=null)=>{
                  }
                  }
                  getDefaultValue={()=>''}
                  query={{
                    key:'AIzaSyCeheP7N3nMtkIeE2P56lW1umQM1fyHCwE',
                    language:'es'
                  }}
                  styles={{
                    zIndex:2000,
                    flex:1,
                    description: {
                      fontWeight: 'bold',
                    },
                    predefinedPlacesDescription: {
                      color: '#1faadb',
                    },
                    listView: {
                      color: 'black', //To see where exactly the list is
                      zIndex: 2000, //To popover the component outwards
                      position: 'absolute'}   
                 }}
                  debounce={200}
                />
        )
    }
}