import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    fontSize: 24,
    borderBottomColor: '#7f8c8d33',
    borderBottomWidth: 2,
    marginBottom: 10,
    textAlign: 'center',
  },
  sendVerification: {
    padding: 20,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  sendCode: {
    padding: 20,
    backgroundColor: '#09567a',
    borderRadius: 100, 
    marginTop: 30
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#ffffff',
  },
});