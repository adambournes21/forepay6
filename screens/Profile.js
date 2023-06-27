import React, {useState, useCallback} from 'react';
import {View, Text, Alert, Image, TouchableOpacity} from 'react-native';

import {TextField, Button} from '../components/Form';
import {fetchUsername, fetchRealName} from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';


const Profile = ({navigation, route}) => {

    const [username, setUsername] = useState('');
    const [realName, setRealName] = useState('');
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchUsername().then((uname) => {
                setUsername(uname);
            });
            fetchRealName().then((rname) => {
                setRealName(rname);
            });
        }, [])
    );

    return (
        <View style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', 
                    height: '100%', width: '100%', backgroundColor: '#EDF6F9', paddingTop: 45}}>
            <View style={{display: 'flex', width: '80%', flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center', 
                    marginTop: '5%', marginBottom: '3%', marginLeft: '20%', marginRight: '20%'}}>
                <TouchableOpacity style={{flex: 2, alignItems: 'center'}} onPress={() => navigation.pop()}>
                    <Image source={require('../images/back.png')}
                        style={{width: 23, height: 23, marginRight: 70, marginTop: -47}} />
                </TouchableOpacity>
                <View style={{flex: 4, textAlign: 'center', alignItems: 'center'}}>
                    <Image source={require('../images/forepay-text-logo.png')}
                            style={{width: 160, height: 35, marginLeft: 15, marginBottom: 7, marginTop: '0%'}} />
                    <Text style={{fontStyle:'italic', marginBottom: '40%', textAlign: 'center'}}>Asking can be awkward</Text>
                </View>
                <TouchableOpacity onPress={null} style={{flex: 2, alignItems: 'center', marginTop: 2}}><Text></Text></TouchableOpacity>
            </View>

            <View style={{flex: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 150}}>
                <Text style={{fontSize: 20, marginBottom: 30}}>Username: {username}</Text>
                <Text style={{fontSize: 20}}>Real Name: {realName}</Text>
            </View>

            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 150}}>
                <Text style={{fontSize: 20, width: '50%', fontSize: 17}}>Please give us any feedback</Text>
                <Text style={{fontSize: 20, width: '50%', fontSize: 17}}> or comments at <Text style={{fontWeight: 'bold', fontSize: 19}}>alex@forepay.io</Text></Text>
            </View>

        </View>
    );
};

export default Profile;