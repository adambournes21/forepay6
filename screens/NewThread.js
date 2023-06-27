import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import { TextField, Button } from '../components/Form';
import { createNewThread } from '../firebaseConfig';

const NewThread = ({navigation}) => {
  const [threadName, setThreadName] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    setLoading(true);
    createNewThread(threadName)
      .then(() => {
      })
      .finally(() => {
        setTimeout(function() {
            navigation.navigate('Threads');
            setLoading(false);
        }, 800);
        
      });
  };

  return (
    <View style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', 
                    height: '100%', width: '100%', backgroundColor: '#EDF6F9', paddingTop: 45}}>
        <View style={{display: 'flex', width: '80%', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', 
                marginTop: '5%', marginBottom: '3%', marginLeft: '20%', marginRight: '20%'}}>
            <TouchableOpacity style={{flex: 2, alignItems: 'center'}} onPress={() => navigation.pop()}>
                <Image source={require('../images/back.png')}
                    style={{width: 25, height: 25, marginRight: 70}} />
            </TouchableOpacity>
            <Text style={{flex: 4, textAlign: 'center', alignItems: 'center', fontSize: 25, fontFamily: 'Arial'}}>Create Group</Text>
            <TouchableOpacity onPress={null} style={{flex: 2, alignItems: 'center', marginTop: 2}}><Text></Text></TouchableOpacity>
        </View>
        <View style={{display: 'flex', width: '80%', flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center', 
            marginTop: '65%', marginBottom: '3%', marginLeft: '10%', marginRight: '20%',
            }}>
            
        </View>
        <Text style={{ fontSize: 20, marginBottom: 50, marginTop: -50 }}>Create a new group:</Text>
        <TextField
            style={{width: 290, textAlign: 'center', marginBottom: 10}}
            placeholder="Add group name"
            onChangeText={name => setThreadName(name)}
        />
        <Button onPress={handlePress} title="Create" disabled={loading} />
    </View>
  );
};

export default NewThread;