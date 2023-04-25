import {  Image, SafeAreaView,ScrollView,Text } from 'react-native'
import {useState,useEffect} from 'react'
import { storage } from '../firebase'
import {  getDownloadURL, listAll, ref} from 'firebase/storage'
import { StatusBar } from 'expo-status-bar'


import ShowImages from '../components/ShowImages'




const Media = () => {
const [url,setUrl] = useState([])
const [img,setImg] = useState(null)


 useEffect(()=>{
  
     getImages()
     
  },[])

  
  
  
 const getImages = async() =>{
  const imageRefs = ref(storage,'images/')
  const listRef = await listAll(imageRefs)
  const item = await Promise.all(listRef.items.map((image)=> getDownloadURL(image)))
  setUrl(item)
  
 } 




 
 
  

  
  
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#030329'}} >
     
     <ScrollView style={{marginTop:25}}>
      <Text style={{color:'white',textAlign:'center',marginTop:25}}>Images</Text>
       <ShowImages url={url} getImages={getImages()}  />
       {img && <Image source={{uri : img}} style={{width:400,height:250}} />}
       
     </ScrollView>
     
     

      
      
     <StatusBar style='light' backgroundColor='black'/>
    </SafeAreaView>
   )
   
  }

  
  
export default Media
