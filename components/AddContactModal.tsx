import React, {useEffect, useRef, useState} from 'react';
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

import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {addPersonalContact} from '../services/UserApi';
import PhoneInput from 'react-native-phone-number-input';
import {showMessage} from 'react-native-flash-message';
import {useTranslation} from 'react-i18next';
import {bold, regular, semiBold, light} from '../styles/fonts';
import {useTheme} from '@react-navigation/native';

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

const AddContactModal = ({modalVisible, setModalVisible, addContact}: any) => {
  const [fname, setFname] = React.useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [error, setError] = useState('');
  const phoneInput = useRef<PhoneInput>(null);
  const [value, setValue] = useState('');
  const [loader, setLoader] = useState(false);
  const {t, i18n} = useTranslation();
  const theme: any = useTheme();

  useEffect(() => {
    if (modalVisible) {
      setValue('');
      setFname('');
      setFormattedValue('');
      phoneInput.current?.setState({number: ''});
    }
  }, [modalVisible]);

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
              backgroundColor: theme.dark ? theme.colors.surface : '#F3F8FF',
              padding: 20,
              width: '100%',
              borderColor: theme.colors.border,
            }}>
            <Text
              style={{
                fontSize: 26,
                fontFamily: bold,
                color: theme.colors.text,
              }}>
              {t('addContact:title')}
            </Text>
            <View>
              <TextInput
                style={{
                  borderRadius: 10,
                  marginTop: '5%',
                  paddingHorizontal: '5%',
                  color: theme.colors.text,
                  backgroundColor: theme.colors.placeholder,
                  height: 50,
                }}
                placeholder={t('addContact:inputPlaceHolder')}
                placeholderTextColor={theme.colors.placeholderText}
                onChangeText={text => {
                  if (error != '') setError('');
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
                    color: theme.colors.surfaceText,
                    fontSize: 14,
                    fontFamily: light,
                  }}>
                  {t('addContact:JohnDoe')}
                </Text>
              </View>
            </View>

            <View style={{marginTop: '5%'}}>
              <PhoneInput
                withDarkTheme={theme.dark}
                ref={phoneInput}
                defaultValue={value}
                defaultCode="GR"
                placeholder={t('addContact:placeholder')}
                layout="first"
                onChangeText={text => {
                  if (error != '') setError('');
                  setValue(text);
                }}
                onChangeFormattedText={text => {
                  setFormattedValue(text);
                }}
                withShadow
                // autoFocus
                containerStyle={{
                  borderRadius: 10,
                  width: '100%',
                  height: 60,
                  backgroundColor: theme.colors.placeholder,
                }}
                textContainerStyle={{
                  borderRadius: 10,
                  backgroundColor: theme.colors.placeholder,
                }}
                textInputStyle={{height: 50, color: theme.colors.surfaceText}}
                textInputProps={{
                  placeholderTextColor: theme.colors.placeholderText,
                }}
                codeTextStyle={{color: theme.colors.text}}
                renderDropdownImage={
                  <Icon name="menu-down" color={theme.colors.icon} size={25} />
                }
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.surfaceText,
                marginTop: '2%',
                fontFamily: light,
              }}>
              {t('addContact:no')}
            </Text>
            {error != '' && (
              <Text
                style={{
                  fontSize: 14,
                  color: 'red',
                  fontFamily: light,
                  alignSelf: 'flex-end',
                }}>
                {error}
              </Text>
            )}
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
                if (formattedValue !== '' && fname !== '') {
                  const checkValid = phoneInput.current?.isValidNumber(value);
                  if (!loader && checkValid) {
                    setLoader(true);
                    addPersonalContact(
                      fname,
                      formattedValue,
                      setLoader,
                      addContact,
                      setModalVisible,
                    );
                  } else {
                    setError('Phone Number Not Valid');
                  }
                } else {
                  setError(t('addContact:messageTwo'));
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
                    {t('addContact:btnText')}
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
                  color={theme.colors.icon}
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
export default AddContactModal;
