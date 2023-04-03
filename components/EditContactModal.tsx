import React, {useRef, useState} from 'react';
import * as yup from 'yup';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Formik} from 'formik';
import {bold, regular, semiBold, light} from '../styles/fonts';

import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {addPersonalContact, editPersonalContact} from '../services/UserApi';
import PhoneInput from 'react-native-phone-number-input';
import {showMessage} from 'react-native-flash-message';

const modalStyles = StyleSheet.create({
  modalContainer: {flex: 1, alignItems: 'center'},
  modalContentContainer: {
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    width: '95%',
  },
  modalBtn: {
    backgroundColor: '#00A7FF',
    borderRadius: 5,
    marginTop: '4%',
    width: '100%',
    height: 40,
  },
  modalBtnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    fontFamily: light,
  },
});

const EditContactModal = ({
  modalVisible,
  setModalVisible,
  editContact,
  selectedItem,
}: any) => {
  const [fname, setFname] = React.useState(selectedItem.title);
  const [formattedValue, setFormattedValue] = useState(selectedItem.contact);
  const phoneInput = useRef<PhoneInput>(null);
  const [value, setValue] = useState('');
  const [loader, setLoader] = useState(false);
  return (
    <>
      <Modal
        animationIn="fadeIn"
        animationInTiming={100}
        animationOut="fadeOut"
        animationOutTiming={100}
        backdropOpacity={0.5}
        isVisible={modalVisible}
        onBackButtonPress={() => {
          setModalVisible(!modalVisible);
        }}
        onBackdropPress={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View
            style={{
              justifyContent: 'center',
              borderRadius: 20,
              position: 'relative',
              backgroundColor: '#F3F8FF',
              padding: 20,
              width: '100%',
              borderColor: 'grey',
            }}>
            <Text
              style={{
                fontSize: 26,
                fontFamily: bold,
                color: 'black',
              }}>
              Edit Contact
            </Text>
            <View>
              <TextInput
                style={{
                  borderRadius: 10,
                  marginTop: '5%',
                  paddingHorizontal: '5%',
                  color: 'black',
                  backgroundColor: '#FFF',
                  height: 50,
                }}
                placeholder="Enter Full Name"
                placeholderTextColor="grey"
                value={fname}
                onChangeText={text => {
                  setFname(text);
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: '2%',
                }}>
                <Text
                  style={{
                    color: '#8199C2',
                    fontSize: 14,
                    fontFamily: light,
                  }}>
                  John Doe
                </Text>
              </View>
            </View>

            <View style={{marginTop: '5%'}}>
              <PhoneInput
                ref={phoneInput}
                defaultValue={value}
                defaultCode="GR"
                layout="first"
                value={formattedValue}
                onChangeText={text => {
                  setValue(text);
                }}
                onChangeFormattedText={text => {
                  setFormattedValue(text);
                }}
                withShadow
                // autoFocus
                containerStyle={{borderRadius: 10, width: '100%', height: 60}}
                textContainerStyle={{borderRadius: 10}}
                textInputStyle={{height: 50}}
                textInputProps={{placeholderTextColor: 'grey'}}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                color: '#A3B5D4',
                marginTop: '2%',
                fontFamily: light,
              }}>
              +923312457412
            </Text>

            <TouchableOpacity
              style={{
                marginTop: '5%',
                backgroundColor: '#2B6AD4',
                height: 60,
                borderRadius: 10,
                justifyContent: 'center',
                alignSelf: 'center',
                width: '100%',
              }}
              onPress={() => {
                if (formattedValue !== '') {
                  if (!loader) {
                    setLoader(true);
                    // editPersonalContact(
                    //   selectedItem._id,
                    //   fname,
                    //   formattedValue,
                    //   setLoader,
                    //   setModalVisible,
                    // );
                  }
                } else {
                  showMessage({
                    message: 'Please Enter Your Phone Number',
                    type: 'warning',
                    icon: 'danger',
                  });
                }
              }}>
              {loader && <ActivityIndicator size={25} color="white" />}
              {!loader && (
                <>
                  <Text
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      fontWeight: '700',
                      fontSize: 16,
                      color: '#FFFFFF',
                    }}>
                    Save
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <View style={{position: 'absolute', right: 10, top: 8}}>
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Icon
                  name={'close-circle-outline'}
                  size={35}
                  color="black"
                  style={{padding: 8}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default EditContactModal;
