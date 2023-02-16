import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Cam from '../components/Cam.js'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Media from '../Screens/Media.js'
import Onboard from '../Screens/Onboard.js'


const Tab = createMaterialBottomTabNavigator()
const Home = () => {
  
 
  
  return (
    
    <Tab.Navigator>
        
       
        <Tab.Screen name = "Media" component={Media} 
        options={{
            tabBarLabel:'Media',
            tabBarIcon : ({color}) =>(
                <MaterialCommunityIcons name='file' color={color} size={26} />
                )
            }} />
         <Tab.Screen name = "Camera" component={Cam} 
            options={{
                tabBarLabel:'Camera',
                tabBarIcon : ({color}) =>(
                    <MaterialCommunityIcons name='camera' color={color} size={26} />
                )
            }} />
        <Tab.Screen name="Logout" component={Onboard} 
        options={{
            tabBarLabel : 'Logout',
            tabBarIcon : ({color}) =>(
                <MaterialCommunityIcons name='login' color={color} size={26} 
                 />
            )
        }} />
    </Tab.Navigator>
    
    
  )
}

export default Home
