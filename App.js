import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterCode from './screens/RegisterCode.js';
import Threads from './screens/Threads.js';
import NewThread from './screens/NewThread.js';
import Chat from './screens/Chat.js';
import PhoneAuth from './screens/PhoneAuth';
import EnterInfo from './screens/EnterInfo';
import AddUser from './screens/AddUser';
import ChatRoster from './screens/ChatRoster';
import CreatePayment from './screens/CreatePayment';
import Profile from './screens/Profile';
import ChatDelete from './screens/ChatDelete';
import PaymentHistory from './screens/PaymentHistory';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="PhoneAuth" component={PhoneAuth}/>
				<Stack.Screen name="RegisterCode" component={RegisterCode}/>
				<Stack.Screen name="Threads" component={Threads}/>
				<Stack.Screen name="NewThread" component={NewThread}/>
				<Stack.Screen name="EnterInfo" component={EnterInfo}/>
				<Stack.Screen name="Chat" component={Chat}/>
				<Stack.Screen name="AddUser" component={AddUser}/>
				<Stack.Screen name="CreatePayment" component={CreatePayment}/>
				<Stack.Screen name="ChatRoster" component={ChatRoster}/>
				<Stack.Screen name="Profile" component={Profile}/>
				<Stack.Screen name="ChatDelete" component={ChatDelete}/>
				<Stack.Screen name="PaymentHistory" component={PaymentHistory}/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}