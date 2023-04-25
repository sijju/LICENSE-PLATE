import { View, Text,StyleSheet,Button,Image, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import {useState,useEffect,useRef}from 'react'
import {ref,uploadBytes} from 'firebase/storage'
import { Camera } from 'expo-camera'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { storage } from '../firebase'
import * as MediaLibrary from 'expo-media-library'
import * as ImagePicker from 'expo-image-picker';







const Cam = () => {
  const cameraRef = useRef()

  
  const [hasCameraPermission,setHasCameraPermission] = useState(null)
  const [hasMediaPermission,setMediaPermission] = useState(null)

  const [image,setImage] = useState(null)

  const [start,setStart] = useState(false)




  
  
  
  
  
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
    

    let newPhoto  = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if(!newPhoto.canceled){
        
      try{

        setImage(newPhoto.assets[0].uri)
       
      }catch(err){
        console.log(err)
      }
    
    }
    
  }

  if(image){
    let savePhoto = async() =>{
     const res = await fetch(image)

     const blob = await res.blob()
     const fileName = 'image-' + Math.floor(Math.random() * 10000) 
     const imagesRef = ref(storage,'images/' + fileName)
     uploadBytes(imagesRef, blob).then((snapshot)=>{
       setImage(undefined)
      
     })
      
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.camera}>
          <Image source={{ uri: image }} style={styles.image} />
          
        </View>
        <View style={{display:'flex', flexDirection:'row',margin:8,}}>
        { hasMediaPermission ? <TouchableOpacity style={{alignItems:'center',backgroundColor:'dodgerblue',padding:10,borderRadius:5,marginRight:5}}  onPress={() => savePhoto()}><Text style={{color:'white'}}>Save</Text></TouchableOpacity> : ''}
       
        <TouchableOpacity title="Cancel" style={{alignItems:'center',backgroundColor:'#fc0233',padding:8,borderRadius:5}}  onPress={() => {
          setImage(undefined)
          
          }} ><Text style={{color:'white'}}>Cancel</Text></TouchableOpacity>
        </View> 
      </SafeAreaView>
    )
  }

  
   
  
  return (
    
     <Camera style={styles.fixedRatio} ref={cameraRef}  ratio={'1:1'} >
      
      
      <View style={styles.buttonContainer} >
      <View style={styles.Select} >
         <TouchableOpacity style={{backgroundColor: 'aliceblue' ,borderRadius:5,padding:3}} >
          <Text style={{fontWeight:'bold',textTransform:'uppercase',fontSize:12,color:'red'}}>Photo</Text>
         </TouchableOpacity>
      </View>
       <MaterialCommunityIcons style={{borderRadius:50,padding:5,alignSelf:'flex-end'}} name='upload-outline' color='#fff' size={40} onPress={takePic}/> 
        
        
      </View>
      
     </Camera>
      
   )
  }
  const styles = StyleSheet.create({
  fixedRatio:{
    flex:1,
    aspectRatio:1,
    
  },
  camera :{
    flex: 2,
    borderRadius: 20
  },
  image: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  container :{
    flex :2,
    alignItems : 'center',
    justifyContent : 'center',
  },
  buttonContainer :{
      display:'flex',
      flexDirection:'row',
      flex:1,
      alignItems:'flex-end',
      justifyContent:'center',
      width:'50%',
      marginBottom:10,
      
    },
    predictionText: {
      color: '#000',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 15
    },
    preview : {
      alignSelf:'stretch',
      flex : 1
    },Select : {
        width:'100%',
        
        position:'absolute',
        display:'flex',
        flexDirection:'row',
        padding:10,
        bottom:50,
        
        justifyContent:'center'
    }
})
export default Cam
  
  

    
     
  
  
  
  
  
      
      
  
  
  
  
  
  