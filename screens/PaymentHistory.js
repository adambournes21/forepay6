import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import SwipeButton from 'rn-swipe-button';

import { fetchUsersInChat, removePayment, fetchPaymentsInChat, auth, fetchPayment } from '../firebaseConfig.js';

const PaymentHistory = ({navigation, route}) => {

    const threadID = route.params.threadID;
    const theUsername = route.params.username;
    const threadName = route.params.threadName;


    const [paymentInfo, setPaymentInfo] = useState({}); //index 0 is description, second is value
    const [selectedPayments, setSelectedPayments] = useState({});
    const [countPayments, setCountPayments] = useState(0);
    const [loading, setLoading] = useState(false);
    const [useless, setUseless] = useState(0);

    const handleSwipe = () => {
        if (countPayments == 0) {
            alert("please select a user");
            return;
        } else {
            const sPayments = [];
            Object.keys(selectedPayments).forEach(p => {
                if (selectedPayments[p]) {
                    sPayments.push(p);
                }
            });
            console.log("list of pids", sPayments, Object.keys(selectedPayments), selectedPayments);
            removePayment(sPayments, threadID);
            navigation.pop();
        }
    };
    

    const onCheck = (pid) => {
        selectedPayments[pid] = !selectedPayments[pid];
        if (selectedPayments[pid]) {
            setCountPayments(countPayments + 1);
        } else {
            setCountPayments(countPayments - 1);
        }
        setSelectedPayments({
            ...selectedPayments,
        });
    }


    useFocusEffect(
        useCallback(() => {
            fetchPaymentsInChat(threadID).then((payments) => {
                return Promise.all(
                    payments.map((pid) => {
                        return fetchPayment(pid)
                        .then(paymentDetails => {
                            console.log("payment details", paymentDetails);
                            if (paymentDetails.sender === theUsername) {
                                return[pid, paymentDetails.description, paymentDetails.value];
                            } else {
                                return null;
                            }
                        })
                    })
                );
            }).then(paymentValues => {
                let pids = {}; //list of people owed
                console.log("payment values", paymentValues);
                paymentValues.map(pair => {
                    console.log("pair", pair);
                    if (pair !== null) {
                        pids[pair[0]] = [pair[1], pair[2]];
                    }
                });
                console.log("pids", pids);
                setPaymentInfo(pids);
            }).catch(err =>
                alert(err, "err")
            );
        }, [])
    );

    function PaymentList () {
        return (
            <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems : 'center', paddingBottom: 20, width: '90%'}}>
                {Object.keys(paymentInfo).map((pid) => {
                    return (
                        <View key={pid} style={{display: 'flex', flexDirection: 'column', marginTop: 8}}>
                            <TouchableOpacity style={{display: 'flex', width: '100%', flexDirection: 'row', backgroundColor: '#A9D6FF', borderRadius: 20}}
                                onPress={() => onCheck(pid)}>
                                <View style={{flexDirection: 'row', flex: 8, 
                                    alignItems: 'center', marginLeft: 10 }}>
                                    { selectedPayments[pid]
                                    ? 
                                        <Image source={require('../images/check-box.png')}
                                        style={{width: 20, height: 20, margin: 17}} />
                                    :
                                        <Image source={require('../images/blank-check-box.png')}
                                        style={{width: 20, height: 20, margin: 17}} />
                                    }
                                    
                                    <Text>{paymentInfo[pid][0].slice(0,20)}</Text>
                                </View>
                                <View style={{flex: 6}} />
                                <Text style={{flex: 3, alignSelf: 'center'}}>${Number(paymentInfo[pid][1]).toFixed(2)}</Text> 
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
        );
    }

    return (
        <View style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', height: '100%'}}>
            <TouchableOpacity onPress={() => navigation.pop()} style={{alignSelf: 'flex-start', marginTop: '18%', flex: 1, width: '100%'}}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flex: 3}}/>
                        <Image source={require('../images/back.png')}
                            style={{width: 22, height: 22, flex: 1}} />
                    <Text style={{flex: 15, fontSize: 23, textAlign: 'center'}}>{threadName} Payments</Text>
                    <View style={{flex: 4}}/>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                    <Text style={{fontSize: 16, marginTop: 27}}>Here are all the individual expenses owed to you:</Text>
                </View>
            </TouchableOpacity>
            <View style={{display: 'flex', flex: 10, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <PaymentList />
            </View>
            <View style={{flex: 3, display: 'flex', width: '90%', marginTop: 20}}>
                {countPayments == 0
                ? 
                <Text style={{ fontSize: 17, marginBottom: 20, alignSelf: 'center' }}>Selected Payments: None</Text>
                :
                <Text style={{ fontSize: 17, marginBottom: 20, alignSelf: 'center' }}>{countPayments} Payments Selected</Text>
                }
                <SwipeButton
                    onSwipeSuccess={handleSwipe}
                    railBackgroundColor="#09567A"  
                    railStyles={{
                    backgroundColor: "#FFFFFF88" ,
                    borderColor: "#AABBFF88",
                    borderWidth: 3,
                    }}
                    titleStyles={{fontSize: 18, color: 'white'}}
                    thumbIconBackgroundColor="#FFFFFF"
                    title="Swipe To Remove Payments"
                    swipeSuccessThreshold={92}
                />
            </View>
            
        </View>
    );
};

export default PaymentHistory;