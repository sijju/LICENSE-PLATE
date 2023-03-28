import { View, Text,TouchableOpacity,StyleSheet } from 'react-native'


import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Login from './Login';
const Onboard = () => {
    const navigation = useNavigation()
    useEffect(()=>{
        handleSignout()
         auth.onAuthStateChanged(()=>{
        
        navigation.navigate(Login)
       })
       
    },[])
    
    const handleSignout = () =>{
        
        signOut(auth).then(()=>{
           alert("SignOut was successful")
           
        }).catch(err =>alert(err.message));
     }
  
}

export default Onboard

const styles = StyleSheet.create({
    container :{
        flex:1,
        backgroundColor: 'aliceblue',
        alignItems:'center',
        justifyContent:'center'
    },
    button : {
        width :'50%',
        backgroundColor:'dodgerblue',
        alignItems:'center',
        padding:10,
        borderRadius:7
    }
})