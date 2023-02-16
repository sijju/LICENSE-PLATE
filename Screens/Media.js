import {  Image, SafeAreaView, View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native'
import {useState,useEffect} from 'react'
import { storage } from '../firebase'
import { getDownloadURL, listAll, ref,uploadBytes } from 'firebase/storage'
import { StatusBar } from 'expo-status-bar'
import * as ImagePicker from 'expo-image-picker';
import TensorflowLite from "@switt/react-native-tensorflow-lite"

const Media = () => {
const [url,setUrl] = useState([])
const [image,setImage] = useState(null)
 useEffect(()=>{
     
     getImages()
  },[])
 const getImages = async() =>{
    const imageRefs = ref(storage,'images/')
    const listRef = await listAll(imageRefs)
    const item = await Promise.all(listRef.items.map((image)=> getDownloadURL(image)))
    setUrl(item)
    
 }
 const uploadImage = async() =>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
   if (!result.canceled) {
      const res = await fetch(result.assets[0].uri)
      const blob = await res.blob()
      const fileName = 'image-' + Math.floor(Math.random() * 10000) 
      const imageRef = ref(storage,'images/' + fileName)
      uploadBytes(imageRef, blob).then((snapshot)=>{
        getImages()
       })
    }


    
  };

  const handleDetect = async(item) =>{
    const modelAsset = Asset.fromModule(require('../assets/model.tflite'))
    await modelAsset.downloadAsync()

    const res = await TensorflowLite.runModelWithFiles({
      model : modelAsset.localUri,
      files : item
    })
  }
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#030329'}} >
      
     <ScrollView style={{marginTop:25}}>
       <View style={{marginTop:10,flex:1,flexDirection:'row',flexWrap:'wrap'}}>

      {url.length > 0 && url.map((item, index) =>(
        <TouchableOpacity key={index} style={{height:150,minWidth:150,flex:1,margin:10}} onPress={()=>handleDetect(item)}>
          <Image source = {{uri : item}} style={{ height:150,minWidth:150,flex:1}} />
        </TouchableOpacity>
      ))}
       </View>
     </ScrollView>
      <TouchableOpacity style={{padding:10,margin:8,borderRadius:10,backgroundColor:"#ECFF",alignItems:'center'}} onPress={uploadImage}>
        <Text style={{fontSize:16,fontWeight:"bold"}}>
         Upload from your device
        </Text>
      </TouchableOpacity>
      { image && <Image source={{uri:image}} />}
     <StatusBar style='light' backgroundColor='black'/>
    </SafeAreaView>
   )
   
  }
  
export default Media
