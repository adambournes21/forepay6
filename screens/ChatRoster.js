import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { onSnapshot } from 'firebase/firestore';
import SwipeButton from 'rn-swipe-button';

import {TextField, Button} from '../components/Form';
import { fetchUsersInChat, settlePayment, fetchPaymentsInChat, auth, fetchPayment } from '../firebaseConfig.js';

const ChatRoster = ({navigation, route}) => {

    const threadID = route.params.threadID;
    const theUsername = route.params.username;
    const threadName = route.params.threadName;
    // const threadID = 'rQs04umArmotjXEuKGHb';
    // const theUsername = 'user2';
    // const threadName = 'Yeh';

    const [chatMembers, setChatMembers] = useState([]);
    const [paymentsForEachUser, setPaymentsForEachUser] = useState({});
    const [pidsForEachUser, setpidsForEachUser] = useState({});
    const [selectedUsers, setSelectedUsers] = useState({});
    const [countUsers, setCountUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [useless, setUseless] = useState(0);

    const handlePress = () => {
        if (countUsers == 0) {
            alert("please select a user");
            return;
            
        } else {
            const sUsers = [];
            Object.keys(selectedUsers).forEach(u => {
                if (selectedUsers[u]) {
                    sUsers.push(u);
                }
            })
            const li = [];
            sUsers.forEach(u => {
                if (pidsForEachUser[u]) {
                    pidsForEachUser[u].forEach(u2 => {
                        li.push([u2, u]);
                    })
                }
            })
            console.log("list of pids", li);
            settlePayment(li, threadID);
            navigation.pop();
        }
    };
    

    const onCheck = (username) => {
        selectedUsers[username] = !selectedUsers[username];
        if (selectedUsers[username]) {
            setCountUsers(countUsers + 1);
        } else {
            setCountUsers(countUsers - 1);
        }
        setSelectedUsers({
            ...selectedUsers,
        });
    }


    useFocusEffect(
        useCallback(() => {
            fetchUsersInChat(threadID).then((users) => {
                setSelectedUsers(Object.assign(...users.map(u => ({ [u]: false })))) //???
                setChatMembers(users.sort());
                fetchPaymentsInChat(threadID).then((payments) => {
                    return Promise.all(
                        payments.map((pid) => {
                            return fetchPayment(pid)
                            .then(paymentDetails => {
                                if (paymentDetails.users.includes(theUsername)) {
                                    return [-paymentDetails.value, [paymentDetails.sender], pid];
                                } else if (paymentDetails.sender === theUsername) {
                                    return[-(-paymentDetails.value), paymentDetails.users, pid];
                                } else {
                                    return null;
                                }
                            })
                        })
                    );
                }).then(paymentValues => {
                    let obj = {}; //values
                    let pids = {}; //list of people owed
                    paymentValues.map(pair => {
                        if (pair == null) {
                        } else {
                            pair[1].map(u => {
                                if (u in obj) {
                                    obj[u] += pair[0];
                                    console.log("pids", u, pids, pids[pair[1]]);
                                    pids[u].push(pair[2]);
                                } else {
                                    obj[u] = pair[0];
                                    pids[u] = [pair[2]];
                                }
                            })
                        }
                    });
                    setPaymentsForEachUser(obj);
                    setpidsForEachUser(pids);
                }).catch(err =>
                    alert(err, "err")
                );
            })
        }, [])
    );

    function UserList () {
        return (
            <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems : 'center', paddingBottom: 20, width: '90%'}}>
                {Object.keys(paymentsForEachUser).map((username) => {
                    if (paymentsForEachUser[username] > 0) {
                        return (
                            <View key={username} style={{display: 'flex', flexDirection: 'column', marginTop: 8}}>
                                <TouchableOpacity style={{display: 'flex', width: '100%', flexDirection: 'row', backgroundColor: '#99FF99', borderRadius: 20}}
                                    onPress={() => onCheck(username)}>
                                    <View style={{flexDirection: 'row', flex: 8, 
                                        alignItems: 'center', marginLeft: 10 }}>
                                        { selectedUsers[username]
                                        ? 
                                            <Image source={require('../images/check-box.png')}
                                            style={{width: 20, height: 20, margin: 17}} />
                                        :
                                            <Image source={require('../images/blank-check-box.png')}
                                            style={{width: 20, height: 20, margin: 17}} />
                                        }
                                        
                                        <Text>{username} Owes You </Text>
                                    </View>
                                    <View style={{flex: 6}} />
                                    <Text style={{flex: 3, alignSelf: 'center'}}>${Number(paymentsForEachUser[username]).toFixed(2)}</Text>
                                    
                                </TouchableOpacity>
                            </View>
                        )
                    } else {
                        return (
                            <View key={username} style={{display: 'flex', flexDirection: 'column', marginTop: 8}}>
                                <TouchableOpacity style={{display: 'flex', width: '100%', flexDirection: 'row', backgroundColor: '#FF9999', borderRadius: 20}}
                                    onPress={() => onCheck(username)}>
                                    <View style={{flexDirection: 'row', flex: 8, 
                                        alignItems: 'center', marginLeft: 10 }}>
                                        { selectedUsers[username]
                                        ? 
                                            <Image source={require('../images/check-box.png')}
                                            style={{width: 20, height: 20, margin: 17}} />
                                        :
                                            <Image source={require('../images/blank-check-box.png')}
                                            style={{width: 20, height: 20, margin: 17}} />
                                        }
                                        
                                        <Text> {username} </Text>
                                    </View>
                                    <View style={{flex: 6}} />
                                    <Text style={{flex: 3, alignSelf: 'center'}}>${-Number(paymentsForEachUser[username]).toFixed(2)}</Text>
                                    
                                </TouchableOpacity>
                            </View>
                        )
                    }
                })}
            </ScrollView>
        );
    }

    return (
        <View style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', height: '100%'}}>
            <TouchableOpacity onPress={() => navigation.pop()} style={{alignSelf: 'flex-start', marginTop: '18%', flex: 1, width: '100%'}}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flex: 2}}/>
                    <Image source={require('../images/back.png')}
                        style={{width: 22, height: 22, flex: 1}} />
                    <View style={{flex: 4}}/>
                    <Text style={{flex: 10, fontSize: 23, textAlign: 'center'}}>{threadName}</Text>
                    <View style={{flex: 7}}/>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                    <Text style={{fontSize: 16, marginTop: 27}}>Here are the people you have payments with:</Text>
                </View>
            </TouchableOpacity>
            <View style={{display: 'flex', flex: 10, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <UserList />
            </View>
            <View style={{flex: 3, display: 'flex', width: '90%', marginTop: 20}}>
                {countUsers == 0
                ? 
                <Text style={{ fontSize: 17, marginBottom: 20, alignSelf: 'center' }}>Selected Users: None</Text>
                :
                <Text style={{ fontSize: 17, marginBottom: 20, alignSelf: 'center' }}>{countUsers} Users Selected</Text>
                }
                <SwipeButton
                    onSwipeSuccess={handlePress}
                    railBackgroundColor="#09567A"  
                    railStyles={{
                    backgroundColor: "#FFFFFF88" ,
                    borderColor: "#AABBFF88",
                    borderWidth: 3,
                    }}
                    titleStyles={{fontSize: 18, color: 'white'}}
                    thumbIconBackgroundColor="#FFFFFF"
                    title="Swipe To Settle Payments"
                    swipeSuccessThreshold={92}
                />
            </View>
            
        </View>
    );
};

export default ChatRoster;