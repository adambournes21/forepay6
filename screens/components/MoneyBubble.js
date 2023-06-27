import { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image } from 'react-native';

export default function MoneyBubble(props) {

    return (
        <View style={{backgroundColor: 'blue', borderWidth: 2, borderColor: 'black', borderRadius: 12,
                    padding: 10, margin: 8, marginBottom: 0 }}>
            <Text>
                This is a money bubble
            </Text>
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
  });

