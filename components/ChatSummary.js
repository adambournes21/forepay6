import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchThreadName, fetchLastMessage, fetchLastMessageTime, fetchPaymentsInChat, fetchUsername, fetchPayment, fetchUsersInChat } from '../firebaseConfig';

export default function ChatSummary(props) {

    const threadID = props.threadID
    const navigation = useNavigation();
    const [username, setUsername] = useState("");
    const [threadName, setThreadName] = useState("");
    const [lastMessageTime, setLastMessageTime] = useState("8:15 a.m.");
    const [lastMessage, setLastMessage] = useState("this is the last message");
    const [ammountReceive, setAmmountReceive] = useState(0);
    const [ammountOwe, setAmmountOwe] = useState(0);

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }



    useFocusEffect(
        useCallback(() => {
            fetchUsername().then((uname) => {
                setUsername(uname);
                return uname;
            }).then((uname) => {
                fetchUsersInChat(threadID).then((users) => {
                    fetchPaymentsInChat(threadID).then((payments) => {
                        return Promise.all(
                            payments.map((pid) => {
                                return fetchPayment(pid)
                                .then(paymentDetails => {
                                    if (paymentDetails.users.includes(uname)) {
                                        return [-paymentDetails.value, [paymentDetails.sender], pid];
                                    } else if (paymentDetails.sender === uname) {
                                        return[-(-paymentDetails.value), paymentDetails.users, pid];
                                    } else {
                                        return null;
                                    }
                                })
                            })
                        );
                    }).then(paymentValues => {
                        let obj = {}; //values of what each person owes
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
                        const ob = {"owes": 0, "owed": 0}
                        Object.keys(obj).forEach(key => {
                            if (obj[key] > 0) {
                                ob["owes"] += obj[key]
                            } else {
                                ob["owed"] -= obj[key]
                            }
                        })
                        setAmmountOwe(ob["owed"].toFixed(2));
                        setAmmountReceive(ob["owes"].toFixed(2));
                    }).catch(err =>
                        alert(err, "err")
                    );
                });
            })
            

            fetchThreadName(threadID).then((tName) => {
                setThreadName(tName);
            });
            fetchLastMessageTime(threadID).then((t) => {
                if (t == "") {
                    setLastMessageTime("None");
                } else {
                    setLastMessageTime(formatAMPM(new Date(t)));
                }
            });
            fetchLastMessage(threadID).then((m) => {
                if (m.length > 4 && m.substring(0, 4) == '!<>?') {
                    setLastMessage(username + ' added a new expense');
                } else {
                    setLastMessage(m.substring(0, 63));
                }
            });

        }, [])
    );

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Chat", { threadID: threadID, username: username })}
                    style={{display: 'flex', flexDirection: 'column', 
                    justifyContent: 'center', alignItems: 'center', alignText: 'center', 
                    paddingBottom: 12, paddingTop: 8, paddingLeft: 20,
                    height: 160, width: '94%', backgroundColor: 'white',
                    borderWidth: 0, borderColor: 'gray', borderRadius: 10, marginTop: 20,
                    ...Platform.select({
                        ios: {
                          shadowColor: 'rgba(0,0,0, .2)',
                          shadowOffset: { height:0, width: 0 },
                          shadowOpacity: 1,
                          shadowRadius: 4,
                        },
                        android: {
                          elevation: 5
                        },
                    })}}>
            <View style={{display: 'flex', flex: 7, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                {/* <Image source={require('../images/group.png')}
                        style={{width: 60, height: 60, marginLeft: 20, marginTop: 0}} /> */}
                <View style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 25, paddingRight: 20, flex: 3}}>{threadName}</Text>
                        <Text style={{flex: 1, paddingRight: 10}}>{lastMessageTime}</Text>
                    </View>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingRight: 25, width: '80%'}}>{lastMessage}</Text>
                </View>
            </View>
            <View style={{display: 'flex', flex: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', paddingTop: 10}}>
                <Text style={{paddingLeft: 5}}>USD$</Text>
                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Text>You Receive </Text>
                    <Text style={{fontSize: 21, color: '#2DC76D', marginRight: 5}}>${ammountReceive}</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'column', paddingRight: 28, alignItems: 'center'}}>
                    <Text>You Owe </Text>
                    <Text style={{fontSize: 21, color: '#FF4C3E', marginRight: 5}}>${ammountOwe}</Text>
                </View>
            </View>            
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

