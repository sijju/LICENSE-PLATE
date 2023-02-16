import { View, Text } from 'react-native'
import React from 'react'
import * as tf from '@tensorflow/tfjs'
import { useState } from 'react'
import { useEffect } from 'react'

const TFlite = () => {
    const [ready,setReady ] = useState(false)

    useEffect(()=>{
        const handleTF = async()=>{
            await tf.ready()
            setReady(true)
            
        }
    },[])
  return (
    <View>
      <Text>TFlite</Text>
    </View>
  )
}

export default TFlite