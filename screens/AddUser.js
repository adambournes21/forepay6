import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Image, TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {Button} from '../components/Form';
import {usernameIsTaken, addUserToThread, fetchUsernames} from '../firebaseConfig';
import { SelectList } from 'react-native-dropdown-select-list'


const AddUser = ({navigation, route}) => {

    const threadID = route.params.threadID;
    const theUsername = route.params.username;
    const [usernames, setUsernames] = useState([]);
    const [selectedUsername, setSelectedUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePress = () => {
        setLoading(true);
        console.log(selectedUsername);
        usernameIsTaken(selectedUsername).then((taken) => {
            if (taken) {
                addUserToThread(selectedUsername, threadID);
                navigation.pop();
            } else {
                alert("This is not a user");
            }
        }).finally(() => {
            setLoading(false);
        })
    };

    useEffect(() => {
        fetchUsernames()
            .then(names => {
                setUsernames(names);
                console.log("names: ", names);
            })
            .catch(error => console.error('Error fetching usernames:', error));
    }, []);

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
                <Text style={{flex: 4, textAlign: 'center', alignItems: 'center', fontSize: 25, fontFamily: 'Arial'}}>Add Members</Text>
                <TouchableOpacity onPress={null} style={{flex: 2, alignItems: 'center', marginTop: 2}}><Text></Text></TouchableOpacity>
            </View>
        <Text style={{ fontSize: 20, marginBottom: 45, marginTop: '50%', width: '60%', textAlign: 'center' }}>Add your friends with their username:</Text>
        {/* <TextInput
            style={{width: 200, fontSize: 20}}
            placeholder="username"
            onChangeText={name => setSelectedUsername(name)}
            autoCapitalize="none" 
            multiline={true}
            autoCorrect={false} 
            maxLength={20}
        /> */}
        <SelectList 
            setSelected={(uname) => setSelectedUsername(uname)}
            data={usernames} 
            save="value"
            search={false}
        />
        <View style={{marginTop: 30}}>

        </View>
        <Button onPress={handlePress} title="Add User" disabled={loading} />
    </View>
  );
};

export default AddUser;