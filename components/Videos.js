import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { deleteObject, ref } from 'firebase/storage'
import { storage } from '../firebase'

import { Video } from 'expo-av'

const Videos = ({videos,getVideos}) => {
  const [visible,setVisible] = useState(false)
  const handlePress = (item) =>{
      
      try{
        const deleteRef = ref(storage,item)
        deleteObject(deleteRef).then(()=>{
          getVideos()
          console.log("Deleted")
        }).catch(err=>{})
      }catch(err){}
      finally{
        setVisible(false)
      }
      
      
  }
  return (
    <View style={{marginTop:10,flex:1,flexDirection:'row',flexWrap:'wrap'}}>
        {videos.length > 0 && videos.map((item,index) =>  ( 
          <TouchableOpacity key={index} style={{height:250,minWidth:250,flex:1,margin:10,alignSelf:'center',position:'relative'}} >
            <Video source = {{uri : item}} useNativeControls style={{ height:250,minWidth:250,flex:1}} isLooping/>
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

export default Videos