import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';

import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {bold, regular, semiBold, light} from '../styles/fonts';
import {t} from 'i18next';
import {useTheme} from '@react-navigation/native';

const ChangeProfileImageModal = ({
  modalVisible,
  setModalVisible,
  setImage,
}: any) => {
  const Camera = async (set: any) => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 600,
        maxWidth: 600,
      },
      (response: any) => {
        if (!response.didCancel) {
          console.log(response?.assets[0].uri);
          setImage({
            uri: response?.assets[0]?.uri,
            type: response?.assets[0]?.type,
            name: response?.assets[0]?.fileName,
          });
          set();
        }
      },
    );
  };

  const Gallery = async (set: any) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 600,
        maxWidth: 600,
      },
      (response: any) => {
        if (!response.didCancel) {
          console.log(response?.assets[0].uri);
          setImage({
            uri: response?.assets[0]?.uri,
            type: response?.assets[0]?.type,
            name: response?.assets[0]?.fileName,
          });
          set();
        }
      },
    );
  };
  const theme: any = useTheme();
  const modalStyles = StyleSheet.create({
    modalContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    modalContentContainer: {
      backgroundColor: theme.dark ? theme.colors.surface : '#F3F8FF',
      borderColor: theme.colors.border,
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      paddingTop: 0,
      width: '95%',
    },
    modalBtn: {
      backgroundColor: '#2B6AD4',
      borderRadius: 5,
      marginTop: 10,
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
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContentContainer}>
            <TouchableOpacity
              style={modalStyles.modalBtn}
              onPress={() => {
                Gallery(() => setModalVisible(!modalVisible));
              }}>
              <Text style={modalStyles.modalBtnText}>
                {t('generalSettings:select')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.modalBtn}
              onPress={() => {
                Camera(() => setModalVisible(!modalVisible));
              }}>
              <Text style={modalStyles.modalBtnText}>
                {t('generalSettings:take')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.modalBtn}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={modalStyles.modalBtnText}>
                {t('generalSettings:cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ChangeProfileImageModal;
