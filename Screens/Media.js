import {  Image, SafeAreaView, View, ScrollView,  TouchableOpacity, Text, Modal, Button } from 'react-native'
import {useState,useEffect} from 'react'
import { storage } from '../firebase'
import {  getDownloadURL, listAll, ref,uploadBytes } from 'firebase/storage'
import { StatusBar } from 'expo-status-bar'
import * as ImagePicker from 'expo-image-picker';

import { Video } from 'expo-av'
import Videos from '../components/Videos'
import ShowImages from '../components/ShowImages'


const URL = 'https://inf-eaa5354f-2071-4e86-aa82-d899bf814211-no4xvrhsfq-uc.a.run.app/detect'; // copy and paste your Theos deployment URL here
const FALLBACK_URL = '';

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function detect(imageFile, url=URL, confThres=0.25, iouThres=0.45,ocrModel='large',ocrClasses='licence',retries=10, delay=0) {
  const data = new FormData();
  data.append('image', imageFile);
  data.append('conf_thres', confThres);
  data.append('iou_thres', iouThres);
  data.append('ocr_model',ocrModel)
  data.append('ocr_classes',ocrClasses)
  
  
  try {
    const response = await axios({ method: 'post', url: url, data: data, headers: { 'Content-Type': 'multipart/form-data' } });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 0 || error.response.status === 413) throw new Error('image too large, please select an image smaller than 25MB.');
      else if (error.response.status === 403) throw new Error('you reached your monthly requests limit. Upgrade your plan to unlock unlimited requests.');
      else if (error.response.data) throw new Error(error.response.data.message);
    } else if (retries > 0) {
      if (delay > 0) await sleep(delay);
      return await detect(imageFile, FALLBACK_URL? FALLBACK_URL:URL, confThres, iouThres, ocrModel,ocrClasses, retries - 1, 2);
    } else {
      return [];
    }
  }
}


const Media = () => {
const [url,setUrl] = useState([])
const[videos,setVideos] = useState([])
const [image,setImage] = useState(null)
const [img,setImg] = useState(null)


 useEffect(()=>{
  
     getImages()
     
  },[])

  useEffect(()=>{
    if(image){
      detectPicture()
    }
  })
  
  useEffect(()=>{
    
    getVideos()
    
 },[])
 const getImages = async() =>{
  const imageRefs = ref(storage,'images/')
  const listRef = await listAll(imageRefs)
  const item = await Promise.all(listRef.items.map((image)=> getDownloadURL(image)))
  setUrl(item)
  
 } 

 const getVideos = async() =>{
  const videoRefs = ref(storage,'videos/')
  const listRef = await listAll(videoRefs)
  const item = await Promise.all(listRef.items.map((vid) => getDownloadURL(vid)))
  setVideos(item)
}

const detectPicture = async() =>{
  if(image){
    try{
      const imageFile = {
        uri : image,
        type: 'image/jpeg',
         name: 'image.jpg'
      }
    setDetections([]);
    
    setDetecting(true);
    setDetected(false);
    const detectedPlate = await detect(imageFile);
    setDetecting(false);
    setDetected(true);
    setDetections(detectedPlate);
    
    console.log(detections)
  } catch (error) {
    console.log(error);
  
    }
  }
}


// const FileDetect = async() =>{
//   let result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
      
      
//   })

  

//   if(!result.canceled){
   
//     try{
//       setImage(result.assets[0].uri)
//       await detectPicture()
//     }catch(err){
//       console.log(err)
//     }
    
    
    
    
    
    
//   }

// }


 
 const uploadFile = async() =>{
 
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
   if (!result.canceled) {
     const type = result.assets[0].type
     setImage(result.assets[0].uri)
     await detectPicture()
     if(type === 'image'){

       const res = await fetch(result.assets[0].uri)
       const blob = await res.blob()
       
       const fileName = 'image-' + Math.floor(Math.random() * 10000) 
       const imageRef = ref(storage,'images/' + fileName)
       uploadBytes(imageRef, blob).then((snapshot)=>{
         getImages()
        
        })
     }else{

       const res = await fetch(result.assets[0].uri)
       
       const blob = await res.blob()
       
       const f = 'video-' + Math.floor(Math.random() * 10000) 
       const videoRef = ref(storage,'videos/'+f)
       uploadBytes(videoRef,blob).then((snapshot)=>{
         getVideos()
         console.log("uploaded!")
        })
      }
    }
  };

  

  
  
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#030329'}} >
     
     <ScrollView style={{marginTop:25}}>
      <Text style={{color:'white',textAlign:'center',marginTop:25}}>Images</Text>
       <ShowImages url={url} getImages={getImages()}  />
       {img && <Image source={{uri : img}} style={{width:400,height:250}} />}
      
      <Text style={{color:'white',textAlign:'center',marginTop:25}}>Videos</Text>
       <Videos videos={videos} getVideos={()=>getVideos()} />
       
     </ScrollView>
     
     

      
      
     <StatusBar style='light' backgroundColor='black'/>
    </SafeAreaView>
   )
   
  }

  
  
export default Media
