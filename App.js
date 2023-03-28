import * as SplashScreen from 'expo-splash-screen'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Screens/Home";
import Login from "./Screens/Login";



const Stack = createStackNavigator()
export default function App() {
  
  SplashScreen.preventAutoHideAsync();
  setTimeout(SplashScreen.hideAsync,1000)
  
  
  return (
    
   <NavigationContainer>
    
     <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerShown:false}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
     </Stack.Navigator>
   </NavigationContainer> 
  );
}
      
    
    
