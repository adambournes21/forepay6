import { useState, useCallback } from 'react';
import { StyleSheet, FlatList, Text, View, Button, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import ChatSummary from '../components/ChatSummary.js';
import { listenToThreads, fetchUsernames } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';


const Threads = ({navigation}) => {

    const [threads, setThreads] = useState([]);
    
    useFocusEffect(
        useCallback(() => {
            fetchUsernames();

            listenToThreads().then((t) => {
                console.log('in threads.js, threads: ', t);
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
                        <ChatSummary key={threadData.threadID} threadID={threadData.threadID} />
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
                    height: '100%', width: '100%', backgroundColor: '#EDF6F9', paddingTop: '7%'}}>
            <View style={{display: 'flex', width: '80%', flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center', 
                    marginTop: '5%', marginBottom: '3%', marginLeft: '20%', marginRight: '20%'}}>
                <TouchableOpacity style={{flex: 3, alignItems: 'center', marginLeft: '5%'}} onPress={() => navigation.navigate('Profile')}>
                    <Image source={require('../images/profile.png')}
                        style={{width: 22, height: 22, marginRight: 70}} />
                </TouchableOpacity>
                <Text style={{flex: 4, alignItems: 'center', marginLeft: '12%', fontSize: 25, fontFamily: 'Arial'}}>Groups</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ChatDelete')} style={{flex: 4, alignItems: 'center', marginTop: 2}}><Text style={{paddingLeft: 54}}>Edit</Text></TouchableOpacity>
            </View>
            <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <ThreadSummaries />
            </View>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('NewThread')}
                style={styles.floatingButton}>
                <Text style={{fontSize: 30, color: 'white', 
                alignSelf: 'center', 
                marginBottom: 3, marginLeft: 1}}>+</Text>
            </TouchableOpacity>
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
        width: 55,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        right: 43,
        bottom: 55,
        backgroundColor: '#09567A',
        borderRadius: 200,
        ...Platform.select({
            ios: {
              shadowColor: 'rgba(0,0,0, .2)',
              shadowOffset: { height:0, width: 0 },
              shadowOpacity: 1,
              shadowRadius: 5,
            },
            android: {
              elevation: 5
            },
        }),
      },
      floatingButtonStyle: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
        //backgroundColor:'black'
      }
  });

export default Threads;