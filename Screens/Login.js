import { useState } from 'react'
import { View,StyleSheet,KeyboardAvoidingView, TextInput, TouchableOpacity, Text, StatusBar, Platform } from 'react-native'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';


import Home  from './Home'

const Login = () => {
  const navigation = useNavigation()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  
  
  
  const handleSignup = () =>{
    createUserWithEmailAndPassword(auth,email, password)
    .then(() => {
      
      alert("User SuccessFully Registered")
      setEmail('')
      setPassword('')
    })
    .catch(error => alert(error.message))
  }
  const handleLogin =() =>{
   
     signInWithEmailAndPassword(auth,email,password)
     .then(()=>{
        const user  = auth.currentUser
        
        { user ? navigation.navigate(Home) : '' } 
     })
     .catch(err=>alert(err.message))
     
  }
  
  return (
   
    <KeyboardAvoidingView style={{flex:1}}  behavior={Platform.OS === 'ios' ? 'padding' : null}>
     <View style={styles.container}>
      <View style={styles.InputContainer}>
        <TextInput placeholder='Email' value={email} onChangeText={text=>setEmail(text)} style={styles.input} />
        <TextInput secureTextEntry placeholder='Password' value={password} onChangeText={text=>setPassword(text)} style={styles.input} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
           <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignup} style={[styles.button,styles.buttonOutline]}>
           <Text  style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
      </View> 
      <StatusBar style="auto" />
     
    </KeyboardAvoidingView>
    
  )
}

export default Login
const styles = StyleSheet.create({
    container :{
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#90ecf5',
    },
    InputContainer :{
      width :'75%',
      margin : 'auto',
      borderColor : 'red',
    },
    input :{
      backgroundColor : '#fff',
      marginTop:7,
      paddingHorizontal:15,
      paddingVertical:10,
      borderRadius : 10,
      
    },
    buttonContainer :{
      width:'60%',
      justifyContent:'space-between',
      alignItems:'center',
      marginTop:40,
      flexDirection :'row',
      
    },
    button :{
      backgroundColor : '#69f06e',
      width : '50%',
      padding:10,
      borderRadius : 10,
      alignItems:'center',
      marginRight :7
    },
    buttonOutline :{
      backgroundColor : '#fff',
     
    },
    buttonText :{
      color :'#fff',
      fontWeight :'700',
      fontSize :15

    },
    buttonOutlineText :{
      color : '#fa6b55',
      fontWeight :'700',
      fontSize:15
    }

    
    
})