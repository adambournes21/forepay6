import React, {useState} from 'react';
import {View, Text, Alert} from 'react-native';

import {TextField, Button} from '../components/Form';
import {usernameIsTaken, updateRealName, setUsernameInfo} from '../firebaseConfig';

const EnterInfo = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [realName, setRealName] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    setLoading(true);
    usernameIsTaken(username).then((isTaken) => {
        if (isTaken) {
            Alert.alert("Username Taken")
        } else {
            setUsernameInfo(username);
            updateRealName(realName);
            navigation.navigate("Threads");
        }
    }).finally(() => {
        setLoading(false);
    })
    
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
      <Text style={{ fontSize: 20, marginBottom: 30, marginTop: -50 }}>Username:</Text>
      <TextField
        autoCorrect={false}
        style={{width: 200}}
        placeholder="johndoe68"
        onChangeText={name => setUsername(name)}
      />
      <Text style={{ fontSize: 20, margin: 30}}>Full Name:</Text>
      <TextField
        autoCorrect={false}
        style={{width: 200}}
        placeholder="John Doe"
        onChangeText={name => setRealName(name)}
      />
      <View style={{marginTop: 20}}>

      </View>
      <Button onPress={handlePress} title="Submit" disabled={loading} />
    </View>
  );
};

export default EnterInfo;