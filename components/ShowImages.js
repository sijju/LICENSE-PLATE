import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { deleteObject, ref } from 'firebase/storage'
import { storage } from '../firebase'






const ShowImages = ({url,getImages,image}) => {
    const [visible,setVisible] = useState(false)
    const [detecting, setDetecting] = useState(false);
    const [detected, setDetected] = useState(false);
    const [detections, setDetections] = useState([]);

    
    const handlePress = (item) =>{
        try{
            const deleteRef = ref(storage,item)
            deleteObject(deleteRef).then(()=>{
              getImages()
              console.log("Deleted")
            }).catch(err=>{})
          }catch(err){}
          finally{
            setVisible(false)
          }
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
  return (
    <View style={{marginTop:10,flex:1,flexDirection:'row',flexWrap:'wrap'}}>
         
        {url.length > 0 && url.map((item, index) =>(
          
          <TouchableOpacity key={index} style={{height:250,minWidth:150,flex:1,margin:10}} >
            <Image source = {{uri : item}} style={{ height:250,minWidth:150,flex:1}} />
            {detecting &&
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color='#ffffff' />
            </View>
            }
           
            <TouchableOpacity onPress={()=>setVisible(true)} title="Cancel" style={{position:'absolute',top:5,right:5,alignItems:'center',backgroundColor:'#ECFFFF',padding:10,borderRadius:5}} >
              <Text style={{color:'red'}}>X</Text>
            </TouchableOpacity>
            {visible && (
            <Modal animationType='slide' visible={visible} transparent>
              <View style={{backgroundColor:'#000000aa',flex:1,alignItems:'center',justifyContent:'center'}}> 
               <View style={{backgroundColor:'white',alignSelf:'center',padding:40,borderRadius:10}}>
               <TouchableOpacity onPress={()=>setVisible(false)} title="Cancel" style={{position:'absolute',top:5,right:5,alignItems:'center',backgroundColor:'#ECFFFF',padding:10,borderRadius:5}} >
                  <Text style={{color:'red'}}>X</Text>
               </TouchableOpacity>
                <Text>Are you sure?</Text>
                <TouchableOpacity onPress={()=>handlePress(item)} style={{backgroundColor:'#fc0233',borderRadius:10,padding:10,alignSelf:'center'}}>
                  <Text>Delete</Text>
                </TouchableOpacity>
               </View>

              </View>
            </Modal>
          )}
          </TouchableOpacity>
          
        ))}
       </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
})

export default ShowImages