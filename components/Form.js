import React from 'react';
import {TextInput, StyleSheet, TouchableOpacity, Text} from 'react-native';

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 20,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderRadius: 10,
    borderWidth: 0,
    borderBottomWidth: 1,
    marginBottom: 0
  },
  button: {
    backgroundColor: '#09567A',
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A6D5FA',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export const TextField = ({style = {}, ...props}) => (
  <TextInput  autoCapitalize="none" multiline={true}
  autoCorrect={false} style={[styles.input, style]} {...props} maxLength={20} />
);

export const Button = ({title, onPress, disabled}) => {
  const buttonStyles = [styles.button];
  if (disabled) {
    buttonStyles.push(styles.buttonDisabled);
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={buttonStyles}
      disabled={disabled}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};