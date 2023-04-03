import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import {bold, regular, semiBold} from '../styles/fonts';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {GoogleAPIKey} from '../services/constants';
import {getPlaceDetails} from '../services/MapApi';
import {useTheme} from '@react-navigation/native';

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContentContainer: {
    height: '30%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
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
  shadow: {
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
});

const MapPointModal = ({modalVisible, setModalVisible, selectedPoint}: any) => {
  const [pointDetail, setPointDetail]: any = useState(null);
  const [loader, setLoader] = useState(false);
  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;
  const [imageLoader, setImageLoader] = useState(false);
  const theme: any = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    closeBtn: {
      position: 'absolute',
      right: 10,
      top: 10,
      borderRadius: 50,
      backgroundColor: theme.colors.surface,
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: bold,
      marginTop: '5%',
    },
    text: {
      color: theme.colors.text,
      fontSize: 16,
      fontFamily: regular,
    },
    directionBtn: {
      marginTop: 10,
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      height: 60,
      borderRadius: 10,

      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#2B6AD4',
    },
  });

  // useEffect(() => {
  //   // setImageLoader(true);
  //   // setLoader(true)
  //   // getPlaceDetails(selectedPoint, setPointDetail, setLoader)

  // })
  return (
    <>
      <Modal
        animationIn="bounceInUp"
        animationInTiming={50}
        backdropOpacity={0.5}
        isVisible={modalVisible}
        onBackButtonPress={() => {
          setModalVisible(!modalVisible);
        }}
        onBackdropPress={() => {
          setModalVisible(!modalVisible);
        }}
        style={{margin: 0, height: '50%'}}>
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContentContainer}>
            {!loader && (
              <View style={styles.container}>
                {/* <View style={{ flex: 1.25, overflow: 'hidden' }}>
                {!imageLoader ? null : (
                  <ActivityIndicator
                    style={{
                      flex: 1,
                    }}
                    color="grey"
                    size="large"
                  />
                )}
                {pointDetail && <Image
                  style={[!imageLoader ? { width: "100%" } : { display: 'none' }, { flex: 1 }]}
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${pointDetail?.photos[0].photo_reference}&key=${GoogleAPIKey}`,
                  }}
                  onLoad={() => {
                    setImageLoader(false);
                  }}
                />}
              </View> */}
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: '5%',
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.title} numberOfLines={2}>
                    {selectedLanguageCode === 'en'
                      ? selectedPoint?.nameEN
                      : selectedPoint?.nameAL
                      ? selectedPoint?.nameAL
                      : selectedPoint?.nameEN}
                  </Text>
                  <Text style={styles.text} numberOfLines={1}>
                    {selectedLanguageCode === 'en'
                      ? selectedPoint?.addressEN
                      : selectedPoint?.addressAL
                      ? selectedPoint?.addressAL
                      : selectedPoint?.addressEN}{' '}
                  </Text>
                  {selectedPoint?.phoneNo && (
                    <Text
                      style={styles.text}
                      numberOfLines={1}
                      onPress={() => {
                        if (selectedPoint?.phoneNo)
                          Linking.openURL(`tel:${selectedPoint?.phoneNo}`);
                      }}>
                      {t('map:phone')}: {selectedPoint?.phoneNo}
                    </Text>
                  )}
                  <View>
                    <TouchableOpacity
                      style={styles.directionBtn}
                      onPress={() => {
                        const scheme = Platform.select({
                          ios: 'maps:0,0?q=',
                          android: 'geo:0,0?q=',
                        });
                        const latLng = `${selectedPoint.lat},${selectedPoint.lng}`;
                        const label = selectedPoint.nameEN;
                        const url: any = Platform.select({
                          ios: `${scheme}${label}@${latLng}`,
                          android: `${scheme}${latLng}(${label})`,
                        });
                        Linking.openURL(url);
                        // Linking.openURL('https://www.google.com/maps/search/?api=1&query_place_id='+ pointDetail.place_id);
                      }}>
                      <Image
                        source={require('../assets/images/g-icon.png')}
                        style={{marginHorizontal: '2%'}}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          color: '#2B6AD4',
                          fontSize: 16,
                          fontFamily: semiBold,
                        }}>
                        {t('map:getDirections')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.closeBtn, modalStyles.shadow]}
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Icon
                    name="close"
                    size={25}
                    color={theme.colors.icon}
                    style={{padding: 4}}
                  />
                </TouchableOpacity>
              </View>
            )}
            {loader && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color="#2B6AD4" />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MapPointModal;
