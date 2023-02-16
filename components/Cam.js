import { View, Text,StyleSheet,Button,Image, SafeAreaView, TouchableOpacity } from 'react-native'
import {useState,useEffect,useRef}from 'react'
import {ref,uploadBytes} from 'firebase/storage'
import { Camera } from 'expo-camera'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { storage } from '../firebase'
import * as MediaLibrary from 'expo-media-library'

const Cam = () => {
  const cameraRef = useRef()
  
  const [hasCameraPermission,setHasCameraPermission] = useState(null)
  const [hasMediaPermission,setMediaPermission] = useState(null)
  const [image,setImage] = useState(null)
  useEffect(()=>{
    (async ()=>{
        const cameraPermission = await Camera.requestCameraPermissionsAsync()
        const mediaPermission = await MediaLibrary.requestPermissionsAsync()
        
        setHasCameraPermission(cameraPermission.status === 'granted')
        setMediaPermission(mediaPermission.status === 'granted')
      })();
  },[])
        
        

  if(hasCameraPermission === undefined) {
    return <Text> Requesting Permissions ...</Text>
  }else if(!hasCameraPermission){
    return <Text>Permission For camera not granted</Text>
  }
  
  const takePic = async() => {
    let options = {
      quality : 1,
      base64 : true,
      exif : false,
    }

    let newPhoto  = await cameraRef.current.takePictureAsync(options)
    setImage(newPhoto)
    
  }

  if(image){
    let savePhoto = async() =>{
     const res = await fetch(image.uri)

     const blob = await res.blob()
     const fileName = 'image-' + Math.floor(Math.random() * 10000) 
     const imagesRef = ref(storage,'images/' + fileName)
     uploadBytes(imagesRef, blob).then((snapshot)=>{
      setImage(undefined)
     })
      
    }
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{uri :"data:image/jpg;base64," + image.base64 }} />
        <View style={{display:'flex', flexDirection:'row',margin:8,}}>
        { hasMediaPermission ? <TouchableOpacity style={{alignItems:'center',backgroundColor:'dodgerblue',padding:10,borderRadius:5,marginRight:5}}  onPress={() => savePhoto()}><Text style={{color:'white'}}>Save</Text></TouchableOpacity> : ''}
        <TouchableOpacity title="Cancel" style={{alignItems:'center',backgroundColor:'#fc0233',padding:8,borderRadius:5}}  onPress={() => setImage(undefined)} ><Text style={{color:'white'}}>Cancel</Text></TouchableOpacity>
        </View> 
      </SafeAreaView>
    )
  }
  return (
     <Camera style={styles.fixedRatio} ref={cameraRef}  ratio={'1:1'} >
      <View style={styles.buttonContainer} >
        <MaterialCommunityIcons name='camera-outline' color='#000' size={40} onPress={takePic}/>
      </View>
     </Camera>
      
   )
  }
  const styles = StyleSheet.create({
  fixedRatio:{
    flex:1,
    aspectRatio:1,
    
  },
  container :{
    flex :2,
    alignItems : 'center',
    justifyContent : 'center',
  },
  buttonContainer :{
      backgroundColor:'aliceblue',
      padding:15,
      marginTop:10,
      borderRadius:50,
      alignSelf:'center',
      
      position:'absolute',
      bottom:10,
      left:140
    },
    preview : {
      alignSelf : 'stretch',
      flex : 1
    }
})
export default Cam
  
  

    
     
  
  
  
  
  
      
      
  
  
  
  
  
  