import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, Alert, Image, TouchableOpacity, ScrollView, StyleSheet, Touchable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { onSnapshot } from 'firebase/firestore';
import SelectDropdown from 'react-native-select-dropdown'

import {TextField, Button} from '../components/Form';
import { fetchUsersInChat, createPayment, createMessage } from '../firebaseConfig.js';
import { setAnalyticsCollectionEnabled } from 'firebase/analytics';

const CreatePayment = ({navigation, route}) => {

    const threadID = route.params.threadID;
    const theUsername = route.params.username;
    const threadName = route.params.threadName;

    const [selectedPayer, setSelectedPayer] = useState(theUsername);
    const [chatMembers, setChatMembers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});
    const [countUsers, setCountUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(0);
    const [description, setDescription] = useState('');

    const handlePress = () => {
        if (value == "" || countUsers == 0) {
            return;
        } else {
            const listUsers = [];
            chatMembers.forEach(u => {
                if (selectedUsers[u]) {
                    listUsers.push(u);
                }
            })
            const user={
                _id: theUsername,
                name: theUsername,
            }

            const message = "Paid by " + selectedPayer + ": $" + parseFloat(value).toFixed(2) + "\n" + listUsers.join(", ") + " for " + description;
            console.log("create payment ", threadID, description, value, listUsers, countUsers, selectedPayer)
            createMessage(threadID, message, user, true)
            .then((message) => {
                return createPayment(threadID, description, parseFloat(value).toFixed(2), listUsers, countUsers, selectedPayer, message);
            })
            .catch((error) => {
                console.error(error);
                alert(error.message);
            });
            //createMessage(threadID, message, user, true);
            //createPayment(threadID, description, parseFloat(value).toFixed(2), listUsers, countUsers, selectedPayer);
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

    const handleValueChange = (text) => {
        // Remove any non-numeric characters from the input
        const numericValue = text.replace(/[^0-9]/g, '');
        setValue(numericValue);
    };

    const setAll = () => {
        let count = 0;
        Object.keys(selectedUsers).map(u => {
            if (selectedUsers[u]) {
                count = count + 1;
            }
        })
        const count2 = chatMembers.length - count
        setCountUsers(countUsers + count2);
        setSelectedUsers(Object.assign(...chatMembers.map(u => ({ [u]: true }))))
    }


    function UserList () {
        return (
            <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems : 'center', paddingBottom: 20, width: '90%'}}>
                {
                chatMembers.map((username) => {
                    return (
                        <View key={username} style={{display: 'flex', flexDirection: 'column', paddingBottom: 12}}>
                            { selectedUsers[username]
                                ? 
                                <TouchableOpacity style={{display: 'flex', width: '100%', flexDirection: 'row', backgroundColor: '#A9D6FF', borderRadius: 20}}
                                onPress={() => onCheck(username)}>
                                    <View style={{flexDirection: 'row', flex: 7, 
                                        alignItems: 'center', marginLeft: 10 }}>
                                        <Image source={require('../images/check-box.png')}
                                            style={{width: 20, height: 20, margin: 13}} />
                                        <Text>{username} Owes </Text>
                                    </View>
                                    <View style={{flex: 6}} />
                                    <Text style={{flex: 3, alignSelf: 'center'}}>${(parseFloat(value) / countUsers).toFixed(2)}</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={{display: 'flex', width: '100%', flexDirection: 'row', backgroundColor: '#EDF6F9', borderRadius: 20}}
                                onPress={() => onCheck(username)}>
                                    <View style={{flexDirection: 'row', flex: 7, 
                                        alignItems: 'center', marginLeft: 10 }}>
                                        <Image source={require('../images/blank-check-box.png')}
                                            style={{width: 20, height: 20, margin: 13}} />
                                        <Text>{username} Owes </Text>
                                    </View>
                                    <View style={{flex: 6}} />
                                    <Text style={{flex: 3, alignSelf: 'center'}}></Text>
                                </TouchableOpacity>
                            }
                        </View>
                    )
                })}
            </ScrollView>
        );
    }

    useFocusEffect(
        useCallback(() => {
            fetchUsersInChat(threadID).then((users) => {
                setChatMembers(users.sort());
                setSelectedUsers(Object.assign(...chatMembers.map(u => ({ [u]: false }))));
            })
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
                        style={{width: 23, height: 23, marginRight: 70}} />
                </TouchableOpacity>
                <Text style={{flex: 4, textAlign: 'center', alignItems: 'center', fontSize: 21, fontFamily: 'Arial'}}>New Expense</Text>
                <TouchableOpacity onPress={null} style={{flex: 2, alignItems: 'center', marginTop: 2}}><Text></Text></TouchableOpacity>
            </View>

            <View style={{flex: 6, display: 'flex', alignItems: 'center'}}>
                <Text style={{ fontSize: 20, margin: 22, alignSelf: 'flex-start', marginTop: 0, marginBottom: 10, marginTop: 15 }}>Who Paid:</Text>
                <View style={{display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', paddingLeft: 20}}>
                    <SelectDropdown
                        dropdownStyle={styles.dropdown2DropdownStyle}
                        rowStyle={styles.dropdown2RowStyle}
                        rowTextStyle={styles.dropdown2RowTxtStyle}
                        buttonStyle={styles.dropdown2BtnStyle}
                        buttonTextStyle={styles.dropdown2BtnTxtStyle}
                        defaultValue={"route.params.username"}
                        defaultButtonText="Select user"
                        data={chatMembers}
                        onSelect={(selectedItem, index) => {
                            setSelectedPayer(selectedItem);
                            //console.log(selectedItem, index)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            //setSelectedPayer(selectedItem);
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item
                        }}
                    />
                </View>
                <Text style={{ fontSize: 20, margin: 22, alignSelf: 'flex-start', marginTop: 0, marginBottom: 10, marginTop: 15 }}>Payment Amount:</Text>
                <View style={{display: 'flex', flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Text style={{paddingLeft: 20, paddingTop: 5, fontSize: 25}}>$</Text>
                    <TextField
                        style={{width: '72%'}}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={value => handleValueChange(value)}
                    />
                </View>
                <Text style={{ fontSize: 20, margin: 22, alignSelf: 'flex-start', marginTop: 17, marginBottom: 10 }}>Description:</Text>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <TextField
                        style={{width: '80%', multiLine: false, numberOfLines: 1}}
                        placeholder="eg. concert tickets"
                        onChangeText={description => setDescription(description)}
                    />
                </View>
                <TouchableOpacity style={{alignSelf: 'flex-start', padding: 24 }} onPress={() => setAll()}>
                    <Text style={{color: '#09567A'}}>Select All</Text>
                </TouchableOpacity>
            </View>
            <View style={{display: 'flex', flex: 6, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <UserList />
            </View>
            <View style={{flex: 2, display: 'flex'}}>
                {/* {countUsers == 0 || value == ''
                ? 
                <Text style={{ fontSize: 20, marginBottom: 20, alignSelf: 'center' }}>Enter a value and select users</Text>
                :
                <Text style={{ fontSize: 20, marginBottom: 20, alignSelf: 'center' }}>Value Owed By Each Person: ${parseInt(value) / countUsers}</Text>
                } */}
                <Button onPress={handlePress} title="Add" disabled={loading} />
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown2BtnStyle: {
      width: '85%',
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#444',
    },
    dropdown2BtnTxtStyle: {color: '#444', textAlign: 'left'},
    dropdown2DropdownStyle: {backgroundColor: '#EFEFEF'},
    dropdown2RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdown2RowTxtStyle: {color: '#444', textAlign: 'left'},
  });

export default CreatePayment;