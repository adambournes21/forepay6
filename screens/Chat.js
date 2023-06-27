import { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import ChatBubble from '../components/ChatBubble.js';
import MoneyBubble from '../components/MoneyBubble.js';
import { onSnapshot } from 'firebase/firestore';
import {GiftedChat, Bubble, messageText, LeftAction, ChatInput, Send, InputToolbar, Time } from 'react-native-gifted-chat';
import { fetchUsername, createMessage, fetchThreadName, listenToMessages, deleteMessageAtIndex } from '../firebaseConfig.js';
import { useFocusEffect } from '@react-navigation/native';


const ChatScreen = ({navigation, route}) => {

    const username = route.params.username;
    const threadID = route.params.threadID;
    const [threadName, setThreadName] = useState("");
    const [messages, setMessages] = useState([]);

    const renderBubble = (props) => {
        if (props.currentMessage.text.slice(0,4) == "!<>?") {
            if (props.currentMessage.text.slice(props.currentMessage.text.indexOf("\n")).includes(username)) {
                const indexNew = props.currentMessage.text.indexOf("\n");
                const indexFor = props.currentMessage.text.indexOf("for");
                const indexLast = props.currentMessage.text.length;
                const countCommas =  props.currentMessage.text.split(",").length;
                const indexDollar = props.currentMessage.text.indexOf("$");
                const value = props.currentMessage.text.slice(indexDollar + 1, indexNew)
                props.currentMessage.text = props.currentMessage.text.slice(4, indexNew + 1) + props.currentMessage.text.slice(indexFor, indexLast) + "\nMy Share: $" + (parseInt(value) / countCommas).toFixed(2);
                return (
                    <Bubble
                        {...props}
                        textStyle={{
                            right: {
                            color: "black"
                            },
                            left: {
                            color: "black"
                            }
                        }}
                        timeTextStyle={{
                            right: {
                            color: "black"
                            },
                            left: {
                            color: "black"
                            }
                        }}
                        wrapperStyle={{
                            right: {
                                backgroundColor: '#EEAAEE',
                                width: 225,
                            },
                            left: {
                                backgroundColor: '#EEAAEE',
                                width: 225,
                            }
                        }}
                    />
                )
            } else {
                const indexNew = props.currentMessage.text.indexOf("\n");
                const indexFor = props.currentMessage.text.indexOf("for");
                const indexLast = props.currentMessage.text.length;
                props.currentMessage.text = props.currentMessage.text.slice(4, indexNew + 1) + props.currentMessage.text.slice(indexFor, indexLast) + "\nMy Share: $0";
                return (
                    <Bubble
                        {...props}
                        textStyle={{
                            right: {
                              color: "black"
                            },
                            left: {
                              color: "black"
                            }
                        }}
                        timeTextStyle={{
                            right: {
                              color: "black"
                            },
                            left: {
                              color: "black"
                            }
                        }}
                        wrapperStyle={{
                            right: {
                                backgroundColor: '#EEAAEE',
                                width: 225,
                            },
                            left: {
                                backgroundColor: '#EEAAEE',
                                width: 225,
                            }
                        }}
                    />
                );
            };
        } else {
            return (
                <Bubble
                    {...props}
                    textStyle={{
                        right: {
                          color: "black"
                        },
                        left: {
                          color: "black"
                        }
                    }}
                    timeTextStyle={{
                        right: {
                          color: "999999"
                        },
                        left: {
                          color: "#999999"
                        }
                    }}
                    wrapperStyle={{
                        right: {
                            backgroundColor: '#DDEEF9'
                        },
                        left: {
                            backgroundColor: '#EEEEEE'
                        }
                    }}
                />
            );
        }
        
    }; 

    const renderActions = (props) => {
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => navigation.navigate('CreatePayment', { threadID: threadID, threadName: threadName, username: username })} style={{}}>
                    <Image source={require('../images/add-money.png')}
                        style={{width: 30, height: 30, marginLeft: 15, marginBottom: 7}} />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => deleteMessageAtIndex(threadID, 0)} style={{}}>
                    <Image source={require('../images/add-money.png')}
                        style={{width: 30, height: 30, marginLeft: 15, marginBottom: 7}} />
                </TouchableOpacity> */}
            </View>
        );
    }

    const renderSend = (props) => {
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Send
                    {...props}
                    containerStyle={{
                    marginTop: 2,
                    marginRight: 13,
                    height: 45,
                    width: 45,
                    justifyContent: 'center',
                    alignItems: 'center',
                    }}
                >
                    <Text style={{marginLeft: -11}}>Send</Text>
                </Send>
            </View>   
        );
    }

    const renderTime = (props) => {
        return (
            <View style={{margin: 2}}>
            </View>   
        );
    }

    useFocusEffect(
        useCallback(() => {
            fetchThreadName(threadID).then((tname) => {
                setThreadName(tname);
            })

            const unsubscribe = onSnapshot(listenToMessages(threadID), querySnapshot => {
                const format = querySnapshot.data().messages.sort((a, b) => b.createdAt - a.createdAt).map(doc => 
                ({
                        _id: doc._id,
                        createdAt: doc.createdAt,
                        text: doc.text,
                        user: doc.user
                    }))
                setMessages(format);
                });
            return unsubscribe;

        }, [])
    );

    return (
        <View style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', 
                    height: '100%', width: '100%', backgroundColor: 'white', paddingTop: '10%'}}>
            <View style={{display: 'flex', width: '80%', flexDirection: 'row',
                    justifyContent: 'center', alignItems: 'center',
                    marginTop: '5%', marginBottom: '0%'
                    }}>
                <TouchableOpacity onPress={() => navigation.pop()} style={{flex: 2, alignItems: 'center'}}>
                    <Image source={require('../images/back.png')}
                        style={{width: 23, height: 23}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('PaymentHistory', { threadID: threadID, threadName: threadName, username: username })} style={{flex: 25, alignItems: 'center'}}>
                    <Image source={require('../images/book.jpeg')}
                        style={{width: 50, height: 50}} />
                </TouchableOpacity>
                <Text style={{fontSize: 23, fontFamily: 'Arial', flex: 20, textAlign: 'center'}}>{threadName}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddUser', { threadID: threadID, threadName: threadName, username: username })} style={{flex: 25, alignItems: 'center'}}>
                    <Image source={require('../images/add-contact.png')}
                        style={{width: 20, height: 20}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ChatRoster', { threadID: threadID, threadName: threadName, username: username })} style={{flex: 2, alignItems: 'center'}}>
                    <Image source={require('../images/roster.png')}
                        style={{width: 25, height: 25}} />
                </TouchableOpacity>
            </View>

            <View style={{display: 'flex', backgroundColor: '#fff', width: '100%', flex: 1,  
                        paddingBottom: 40}}>
                <GiftedChat
                    textInputStyle={styles.contentContainer}
                    messages={messages}
                    onSend={(newMessages) => {
                        const text = newMessages[0].text;
                        const user = newMessages[0].user;
                        createMessage(threadID, text, user, false);
                    }}
                    renderUsernameOnMessage={true}
                    renderActions={renderActions}
                    alwaysShowSend={true}
                    renderAvatar={null}
                    renderTime={renderTime}
                    user={{
                        _id: username,
                        name: username,
                    }}
                    bottomOffset={10}
                    renderBubble={renderBubble}
                    renderSend={renderSend}
                    renderInputToolbar={(props) => (
                        <InputToolbar {...props} containerStyle={{borderTopWidth: 0, ...Platform.select({
                        ios: {
                          shadowColor: 'rgba(0,0,0, .02)',
                          shadowOffset: { height:-5, width: 0 },
                          shadowOpacity: 1,
                          shadowRadius: 1,
                        },
                        android: {
                          elevation: 5
                        },
                    })}} />
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#EDF6F9',
        borderRadius: 50,
        marginRight: 15,
        borderColor: 'white', 
        paddingLeft: 16,
        paddingTop: 0,
    },
  });



export default ChatScreen;