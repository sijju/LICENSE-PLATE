import { View, Text,StyleSheet,Button,Image, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import {useState,useEffect,useRef}from 'react'
import {ref,uploadBytes} from 'firebase/storage'
import { Camera } from 'expo-camera'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { storage } from '../firebase'
import * as MediaLibrary from 'expo-media-library'
import { Video } from 'expo-av'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker';
import Canvas from 'react-native-canvas'

const Url = 'https://inf-eaa5354f-2071-4e86-aa82-d899bf814211-no4xvrhsfq-uc.a.run.app/detect'

const CLASS_COLORS = {
  
  border: 'rgb(249, 146, 82)',
  fill: 'rgba(249, 146, 82, 0.5)'


}



function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function detect(imageFile, url=Url, confThres=0.25, iouThres=0.45,ocrModel="large",ocrClasses="licence",retries=10, delay=0) {
  const data = new FormData();
  data.append('image', imageFile);
  data.append('conf_thres', confThres);
  data.append('iou_thres', iouThres);
  if(ocrModel !== undefined){

    data.append('ocr_model',ocrModel)
  }
  if(ocrClasses !== undefined){
    data.append('ocr_classes',ocrClasses)
  }
  
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
      return await detect(imageFile, FALLBACK_URL? FALLBACK_URL:URL, confThres, iouThres, retries - 1, 2);
    } else {
      return [];
    }
  }
}





const Cam = () => {
  const cameraRef = useRef()
  const videoRef = useRef(null)
  
  const [hasCameraPermission,setHasCameraPermission] = useState(null)
  const [hasMediaPermission,setMediaPermission] = useState(null)
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  const [originalImageWidth, setOriginalImageWidth] = useState(null);
  const [image,setImage] = useState(null)
  const [record,setRecord] = useState(null)
  const [start,setStart] = useState(false)
  const [type,setType] = useState('')
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(false);
  const [detections, setDetections] = useState([]);


  
  function drawLabel(ctx, box, scale, canvas) {
    ctx.font = '1em Arial';
  
    const text = box.confidence;
    const textMeasure = ctx.measureText(text);
    const horizontalPadding = 5;
    const verticalPadding = -15;
    const textWidth = textMeasure.width + horizontalPadding * 2;
    const textHeight = parseInt(ctx.font) + verticalPadding * 2;
    let x = box.x * scale;
    let y = box.y * scale;
  
    if (x < 0) x = 0;
    else if (x + textWidth > canvas.width) x = canvas.width - textWidth;
  
    if (y - textHeight < 0) y = textHeight;
    else if (y + textHeight > canvas.height) y = canvas.height - textHeight;
  
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.1;
    ctx.fillText(text, x + horizontalPadding, y + 6 * (textHeight / 4));
    ctx.strokeText(text, x + horizontalPadding, y + 6 * (textHeight / 4));
  }
  
  function drawBox(ctx, box, scale) {
    ctx.beginPath();
    ctx.rect(
      box.x * scale,
      box.y * scale,
      box.width * scale,
      box.height * scale
    );
    ctx.lineWidth = 1.5;
    ctx.fillStyle = CLASS_COLORS.fill;
    ctx.strokeStyle = CLASS_COLORS.border;
    ctx.fill();
    ctx.stroke();
  }
  
  function drawDetection(ctx, detection, scale, canvas) {
    drawBox(ctx, detection, scale);
    drawLabel(ctx, detection, scale, canvas);
  }
  
  function handleCanvas(canvas) {
    if (canvas) {
      canvas.width = imageWidth;
      canvas.height = imageHeight;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      detections.forEach((detection) => {
        drawDetection(ctx, detection, imageWidth / originalImageWidth, canvas);
      });
    }
  }
  
  
  
  useEffect(()=>{
    (async ()=>{
        const cameraPermission = await Camera.requestCameraPermissionsAsync()
        const mediaPermission = await MediaLibrary.requestPermissionsAsync()
        
        setHasCameraPermission(cameraPermission.status === 'granted')
        setMediaPermission(mediaPermission.status === 'granted')
      })();
  },[])

  useEffect(()=>{
    if(image){
      detectPicture()
    }
  },[image])
        
        

  if(hasCameraPermission === undefined) {
    return <Text> Requesting Permissions ...</Text>
  }else if(!hasCameraPermission){
    return <Text>Permission For camera not granted</Text>
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
        await detectPicture()
      }catch(err){
        console.log(err)
      }
    
    }
    
  }

  
  
 

  const recordVideo = async() =>{
    setStart(true)
    let options={
      quality:1,
      maxDuration:60,

    }
    let newVideo = await cameraRef.current.recordAsync(options)
    setRecord(newVideo.uri)
   
  }
  
  const stopVideo = async() =>{
     await cameraRef.current.stopRecording()
     setStart(false)
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
          <Image source={{ uri: image }} style={styles.image}
            onLayout={(event) => {
              var { x, y, width, height } = event.nativeEvent.layout;
              setImageWidth(width);
              setImageHeight(height);
            }} />
          {detecting &&
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color='#ffffff' />
            </View>
          }
          <Canvas ref={handleCanvas} />
        </View>
        <View>

        {detections.map((detection) => <Text key={detection.confidence} style={styles.predictionText}>{detection.text}</Text> ) }
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

  
   
  if(record){
    let saveVideo = async() =>{
      const res = await fetch(record)

      const blob = await res.blob()
      const fileName = 'Video-' + Math.floor(Math.random() * 10000)
      const videoRef = ref(storage,'videos/'+ fileName)
      uploadBytes(videoRef,blob).then((snapshot)=>{
        setRecord(undefined)
        
      })
    }

    
    return (
      <SafeAreaView style={styles.container}>
        <Video ref={videoRef} style={styles.preview} source={{uri : record}} useNativeControls resizeMode='contain' isLooping={false} />
        <View style={{display:'flex',flexDirection:'row',margin:8}}>
          {hasMediaPermission ? <TouchableOpacity style={{alignItems:'center',backgroundColor:'dodgerblue',padding:10,borderRadius:5,marginRight:5}} onPress={()=>saveVideo()}><Text style={{color:'white'}}>Save</Text></TouchableOpacity> : ''}
          <TouchableOpacity title="Cancel" style={{alignItems:'center',backgroundColor:'#fc0233',padding:8,borderRadius:5}}  onPress={() => {
            setRecord(undefined)
            setStart(false)
            } } ><Text style={{color:'white'}}>Cancel</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
  return (
    
     <Camera style={styles.fixedRatio} ref={cameraRef}  ratio={'1:1'} >
      
      
      <View style={styles.buttonContainer} >
      <View style={styles.Select} >
         <TouchableOpacity  style={{marginRight:3,backgroundColor: type === 'video' ? 'aliceblue' : 'transparent',borderRadius:5,padding:3}} onPress={()=>setType('video')}><Text style={{fontWeight:'bold',textTransform:'uppercase',fontSize:12,color:'red'}}>Video</Text></TouchableOpacity>
         <TouchableOpacity style={{backgroundColor: type === 'image' ? 'aliceblue' : 'transparent',borderRadius:5,padding:3}} onPress={()=>setType('image')}>
          <Text style={{fontWeight:'bold',textTransform:'uppercase',fontSize:12,color:'red'}}>Photo</Text>
         </TouchableOpacity>
      </View>
       {type==='image' && <MaterialCommunityIcons style={{borderRadius:50,padding:5,alignSelf:'flex-end'}} name='camera-outline' color='#fff' size={40} onPress={takePic}/> }
        
        {start ? <MaterialCommunityIcons name='stop' style={{borderRadius:50,padding:5}} color="#fff" size={40} onPress={()=>stopVideo()} /> :( 
         type === 'video' && <MaterialCommunityIcons style={{borderRadius:50,padding:5,alignSelf:'flex-end'}} name='video-outline' color='#fff' size={40} onPress={()=>recordVideo()} /> )
        }
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
  
  

    
     
  
  
  
  
  
      
      
  
  
  
  
  
  