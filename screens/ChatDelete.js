import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, Text, View, Button, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import RemoveChatSummary from '../components/RemoveChatSummary.js';
import {listenToThreads} from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';


const ChatDelete = ({navigation}) => {

    const [threads, setThreads] = useState([]);
    
    useFocusEffect(
        useCallback(() => {
            listenToThreads().then((t) => {
                setThreads(t);
            })
          // Do something when the screen is focused
          return () => {
            // Do something when the screen is unfocused
            // Useful for cleanup functions
          };
        }, [])
    );

    function ThreadSummaries () {
        return (
            <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems : 'center', paddingBottom: 20}}>
                {threads.length >= 1 ? (
                    threads.map((threadData) => (
                        <RemoveChatSummary key={threadData.threadID} threadID={threadData.threadID} />
                    ))
                ) : (
                    <Text style={{marginTop: '80%', width: '70%', textAlign: 'center'}}>
                        Need somebody to talk to? Get your friends on Forepay
                    </Text>
                )}        
            </ScrollView>
        );
    }

    return (
        <View style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', 
                    height: '100%', width: '100%', backgroundColor: '#EDF6F9', paddingTop: 45}}>
            <View style={{display: 'flex', width: '80%', flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center', 
                    marginTop: '5%', marginBottom: '3%', marginLeft: '20%', marginRight: '20%'}}>
                <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={() => navigation.navigate('Threads')}>
                    <Image source={require('../images/back.png')}
                        style={{width: 25, height: 25, marginRight: 60}} />
                </TouchableOpacity>
                <Text style={{flex: 4, alignItems: 'center', textAlign: 'center', fontSize: 25, fontFamily: 'Arial'}}>Remove Chat</Text>
                <TouchableOpacity onPress={null} style={{flex: 1, alignItems: 'center', marginTop: 2}}><Text></Text></TouchableOpacity>
            </View>
            <Text style={{fontSize: 16, marginTop: 60, marginBottom: 40, color: '#09567A'}}>Choose the chat to delete:</Text>
            <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <ThreadSummaries />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    floatingButton: {
        position: 'absolute',
        width: 69,
        height: 69,
        alignItems: 'center',
        justifyContent: 'center',
        right: 43,
        bottom: 55,
        backgroundColor: '#77BBFF',
        borderRadius: 200
      },
      floatingButtonStyle: {
        resizeMode: 'contain',
        width: 30,
        height: 30,
        //backgroundColor:'black'
      }
  });

export default ChatDelete;