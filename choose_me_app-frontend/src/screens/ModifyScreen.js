import { View, Text } from 'react-native'
import React,{useState,useEffect} from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { Separator } from '../components'
import UserService from '../services/UserService';

const ModifyScreen = () => {
    const [username, setUsername] = useState('');

    const saveModify=()=>{

    }

    useEffect(()=>{
        const getData = async () => {
          try { 
            let response = await UserService.getUserData();  
            let userData = response.data;
            setUsername(userData.data.name) 
            setEmail(userData.data.email)
          } catch (error) {
            return {
              status: false,
              message: `${error?.message}`,
            };
          }
        };
        getData()
      },[])
  return (
    <View>
        <Separator height={50}/>
        <TouchableOpacity onPress={()=>{saveModify}}><Text>Save</Text></TouchableOpacity>
      <TextInput style={{fontSize:30}}>{username}</TextInput>
    </View>
  )
}

export default ModifyScreen