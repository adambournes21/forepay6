import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, View, Image, Alert } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebaseConfig, createAccountIfNotUser, checkIfPhoneExists, fetchUsernames} from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import PhoneInput from "react-native-phone-number-input";
import styles from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';


const PhoneAuth = ({navigation}) => {
    const [phoneNumberWithCode, setPhoneNumberWithCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);
    const [confirming, setConfirming] = useState(true);
    const [messageSent, setMessageSent] = useState(false);

    const press = () => {
        setPhoneNumber('');
        setCode('');
        setConfirming(true);

    }

    const confirmPage = () => {
        setConfirming(!confirming);
    };

    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        console.log('a message should have been sent to ', phoneNumberWithCode);
        phoneProvider
        .verifyPhoneNumber(phoneNumberWithCode, recaptchaVerifier.current)
        .then(setVerificationId);
        setCode('');
        setMessageSent(!messageSent);
    };

    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );

        firebase.auth().signInWithCredential(credential)
        .then((userCredential) => {
            setCode('');
            checkIfPhoneExists(phoneNumberWithCode).then((userExists) => {
                if (userExists) {
                    navigation.navigate('Threads');
                } else {
                    navigation.navigate('EnterInfo');
                }
            })
            createAccountIfNotUser(phoneNumberWithCode);
            AsyncStorage.clear();
            AsyncStorage.setItem('phone', phoneNumber);
            AsyncStorage.setItem('countryCode', phoneNumberWithCode);

            // console.log("userCredential", userCredential, userCredential.user.uid);
            // console.log("realCredential from firebase auth: ", firebase.auth().currentUser.getIdToken(/* forceRefresh */ true))

            // firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
            // .then(function(idToken) {
            //   // Send the token to your backend via HTTPS
            //   const url = 'https://us-central1-forepay-v1-f51b9.cloudfunctions.net/exchangeToken';
            //   const data = {
            //     idToken: idToken,
            //     // Include any other necessary data to send to your backend
            //   };
              
            //   console.log("idToken", idToken);
    
            //   fetch(url, {
            //     method: 'POST',
            //     headers: {
            //       'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data),
            //   })
            //   .then((response) => response.json())
            //   .then((data) => {
            //     console.log("API response body:", data);
            //     const customToken = data.customToken;
            //     console.log("customToken:", customToken);
            
            //     // Store the custom token in AsyncStorage or perform additional actions
            //     // ...
            //   })
            //   .catch((error) => {
            //     console.log('Error exchanging token:', error);
            //   });
    
              // Store the ID token in AsyncStorage
            //   AsyncStorage.setItem('authToken', idToken)
            //     .then(() => {
            //       console.log("ID Token stored in AsyncStorage");
            //     })
            //     .catch((error) => {
            //       console.log('Error storing ID Token:', error);
            //     });
            // })
            // .catch(function(error) {
            //   console.log("Error getting ID Token:", error);
            // });

            // fetch('https://us-central1-forepay-v1-f51b9.cloudfunctions.net/exchangeToken', {
            //     method: 'POST',
            //     headers: {
            //       'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ idToken: userCredential.user.uid }),
            // })
            //     .then((response) => response.json())
            //     .then((data) => {
            //       const customToken = data.customToken;
            //       console.log("customToken", customToken);
            //       console.log("data", data);
        
            //       // Store the custom token in AsyncStorage
            //       AsyncStorage.setItem('customToken', customToken)
            //         .then(() => {
            //           console.log("Custom token stored in AsyncStorage");
            //         })
            //         .catch((error) => {
            //           console.log('Error storing custom token:', error);
            //         });
            //     })
            //     .catch((error) => {
            //       console.log('Error exchanging token:', error);
            // });


            // userCredential.user.getIdToken().then((authToken) => {
            //     AsyncStorage.setItem('authToken', authToken);
            //     console.log("authToken", authToken);
            // });

        }).catch((error) => {
            console.log(error);
        });

    };


    useEffect(() => {

        AsyncStorage.getItem('phone').then((phone) => {
          if (phone.length > 8) {
            setPhoneNumber(phone);
          }
        });
      
        AsyncStorage.getItem('countryCode').then((countryCode) => {
          if (countryCode.length > 8) {
            setPhoneNumberWithCode(countryCode);
          }
        });
      }, []);
      
      useEffect(() => {
        if (phoneNumberWithCode.length > 11) {
            setConfirming(!confirming);
        }
        
      }, [phoneNumberWithCode]);      
      


  return (
    <KeyboardAwareScrollView contentContainerStyle={{aligntext: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: '#edf6f9', height: '100%'}}>
        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
            attemptInvisibleVerification={true}
            />
            {confirming
            ? 
            <View style={{width: '70%', marginBottom: '10%', alignItems: 'center', justifyContent: 'center'}}>
                <Image source={require('../images/forepay-text-logo.png')}
                        style={{width: 210, height: 47, marginLeft: 15, marginBottom: 7, marginTop: '-55%'}} />
                <Text style={{fontStyle:'italic', marginBottom: '40%', textAlign: 'center'}}>Asking can be awkward</Text>
                <Text style={{fontSize: 17, marginBottom: '10%', textAlign: 'center'}}>Enter your phone number to login or create an account:</Text>
                <View style={{marginBottom: 30}}>
                    <PhoneInput
                        defaultValue={phoneNumber}
                        defaultCode="US"
                        layout="first"
                        onChangeText={(text) => {
                            setPhoneNumber(text);
                        }}
                        onChangeFormattedText={(text) => {
                            setPhoneNumberWithCode(text);
                        }}
                        withDarkTheme
                        withShadow
                        autoFocus
                    />
                </View>
                
                <TouchableOpacity
                style={styles.sendCode}
                disabled={!phoneNumber}
                onPress={confirmPage}
                >
                    <Text style={[styles.buttonText, { width: 150 }]}>Next</Text>
                </TouchableOpacity>
            </View>
            
            : 
            <View style={{width: '70%', marginBottom: '10%'}}>
                <TouchableOpacity style={{alignItems: 'center'}} onPress={() => press()}>
                    <Image source={require('../images/back.png')}
                        style={{width: 25, height: 25, marginTop: '-45%', marginLeft: '-110%'}} />
                </TouchableOpacity>

                {!messageSent ? (
                <TouchableOpacity style={[styles.sendCode, { marginBottom: 40 }]} onPress={sendVerification}>
                    <Text style={[styles.buttonText]}>Send Code</Text>
                </TouchableOpacity>
                ) : (
                <View style={{ height: 140 }}></View>
                )}

                <Text style={{fontSize: 17, marginBottom: 40, marginTop: '0%', textAlign: 'center'}}>A code has been sent to: {phoneNumber}. Please enter your confirmation code below:</Text>
                <TextInput
                placeholder="Confirmation Code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={styles.textInput}
                />

                {messageSent ? (
                <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                ) : (
                <View style={{ height: 100 }}></View>
                )}

            </View>
            }
            
        </View>
    </KeyboardAwareScrollView>
  );
};

export default PhoneAuth;