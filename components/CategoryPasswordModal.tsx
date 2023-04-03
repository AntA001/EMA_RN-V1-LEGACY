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
import {bold, regular, semiBold, light} from '../styles/fonts';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';
import base64 from 'react-native-base64';
import {useTranslation} from 'react-i18next';
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

const CategoryPasswordModal = ({
  modalVisible,
  setModalVisible,
  selectedItem,
  selectUserCategory,
}: any) => {
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [passwordsecure, setPasswordSecure] = React.useState(true);

  const theme: any = useTheme();

  const {t, i18n} = useTranslation();

  useEffect(() => {
    if (!modalVisible && password != '') {
      setPassword('');
    }
  }, [modalVisible]);

  return (
    <>
      <Modal
        animationIn="fadeIn"
        animationInTiming={100}
        animationOut="fadeOut"
        animationOutTiming={100}
        backdropOpacity={0.3}
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
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <Text
                style={{
                  fontSize: 26,
                  fontFamily: bold,
                  color: 'black',
                  flex: 1,
                }}>
                {t('categoryPasswordModal:title')}
              </Text>
              <View style={{}}>
                <TouchableOpacity
                  style={{
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
            <View
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: '5%',
                  backgroundColor: theme.colors.placeholder,
                  borderRadius: 10,
                },
                shadowStyles.shadow,
              ]}>
              <TextInput
                style={{
                  marginHorizontal: 8,
                  paddingHorizontal: '2%',
                  color: theme.colors.text,
                  backgroundColor: theme.colors.placeholder,
                  width: '85%',
                  fontSize: 16,
                  fontFamily: regular,
                  height: 50,
                }}
                placeholder={t('categoryPasswordModal:placeholder')}
                placeholderTextColor="grey"
                value={password}
                secureTextEntry={passwordsecure}
                onChangeText={text => {
                  setPassword(text);
                }}
              />
              <View style={{alignItems: 'center', width: '10%'}}>
                <Icon
                  style={{paddingTop: 8, paddingBottom: 8}}
                  name={passwordsecure ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="gray"
                  onPress={() => setPasswordSecure(!passwordsecure)}
                />
              </View>
            </View>
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
                if (password !== '' && selectedItem) {
                  if (selectedItem?.password) {
                    let pass = base64.decode(selectedItem?.password);
                    if (pass === password) {
                      setPassword('');
                      selectUserCategory(selectedItem._id);
                    } else {
                      showMessage({
                        message: t('categoryPasswordModal:incorrectMessage'),
                        type: 'warning',
                        icon: 'danger',
                      });
                    }
                  }
                } else {
                  showMessage({
                    message: t('categoryPasswordModal:emptyMessage'),
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
                    {t('categoryPasswordModal:btnText')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const shadowStyles = StyleSheet.create({
  shadow: {
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 5,
  },
});

export default CategoryPasswordModal;
