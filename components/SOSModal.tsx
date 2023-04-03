import React, {useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {sosCall} from '../services/UserApi';
import {useTranslation} from 'react-i18next';
import {bold, regular, semiBold} from '../styles/fonts';

const modalStyles = StyleSheet.create({
  modalContainer: {flex: 1, alignItems: 'center', maxWidth: 500},
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
});
import {SosAlertType} from '../constants/SosAlertType';
import {useTheme} from '@react-navigation/native';

const SOSModal = ({modalVisible, setModalVisible}: any) => {
  const [policeLoader, setPoliceLoader] = useState(false);
  const [healthLoader, setHealthLoader] = useState(false);
  const [fireLoader, setFireLoader] = useState(false);
  const [testLoader, setTestLoader] = useState(false);

  const {t, i18n} = useTranslation();
  const theme: any = useTheme();

  const selectedLanguageCode = i18n.language;

  const checkLoaders = () => {
    return !policeLoader && !healthLoader && !fireLoader && !testLoader
      ? false
      : true;
  };

  const ErrorAlert = (errMsg: string) =>
    Alert.alert(t('sos:error'), errMsg, [{text: 'OK', onPress: () => {}}]);

  const SendSosAlert = async (type: any) => {
    await Geolocation.getCurrentPosition(
      (info: any) => {
        let location = {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        };
        sosCall(
          SosAlertType.fire === type
            ? setFireLoader
            : SosAlertType.health === type
            ? setHealthLoader
            : SosAlertType.police === type
            ? setPoliceLoader
            : setTestLoader,
          setModalVisible,
          location.latitude,
          location.longitude,
          selectedLanguageCode,
          type,
        );
      },
      (err: any) => {
        console.log(err);
        ErrorAlert(t('sos:errorText'));
      },
    );
  };

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
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: '70%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              position: 'relative',
              backgroundColor: theme.colors.surface,
              padding: 10,
              width: '100%',
              borderColor: theme.colors.border,
              maxWidth: 500,
            }}>
            <View
              style={{
                flex: 0.9,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../assets/images/notify.png')}
                style={{width: 170, height: 170}}
              />
            </View>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: bold,
                  color: theme.colors.text,
                }}>
                {t('sos:title')}
              </Text>
              <Text
                style={{
                  marginTop: '4%',
                  fontSize: 14,
                  fontFamily: regular,
                  textAlign: 'center',
                  color: '#777B83',
                }}>
                {t('sos:description')}
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  margin: '1%',
                  backgroundColor: 'red',
                  height: 60,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '30%',
                }}
                disabled={checkLoaders()}
                onPress={() => {
                  SendSosAlert(SosAlertType.fire);
                }}>
                {fireLoader && <ActivityIndicator size={25} color="white" />}
                {!fireLoader && (
                  <>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../assets/images/fire.png')}
                        style={{width: 30, height: 30}}
                      />
                    </View>

                    <Text
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: 12,
                        fontFamily: semiBold,
                        color: '#FFFFFF',
                      }}>
                      {t('sos:fireBtnText')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  margin: '1%',
                  backgroundColor: 'lightgrey',
                  height: 60,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '30%',
                }}
                disabled={checkLoaders()}
                onPress={() => {
                  SendSosAlert(SosAlertType.health);
                }}>
                {healthLoader && <ActivityIndicator size={25} color="white" />}
                {!healthLoader && (
                  <>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../assets/images/health.png')}
                        style={{width: 30, height: 30}}
                      />
                    </View>

                    <Text
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: 12,
                        fontFamily: semiBold,
                        color: '#FFFFFF',
                      }}>
                      {t('sos:healthBtnText')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  margin: '1%',
                  backgroundColor: 'royalblue',
                  height: 60,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '30%',
                }}
                disabled={checkLoaders()}
                onPress={() => {
                  SendSosAlert(SosAlertType.police);
                }}>
                {policeLoader && <ActivityIndicator size={25} color="white" />}
                {!policeLoader && (
                  <>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../assets/images/police.png')}
                        style={{width: 30, height: 30}}
                      />
                    </View>

                    <Text
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: 12,
                        fontFamily: semiBold,
                        color: '#FFFFFF',
                      }}>
                      {t('sos:policeBtnText')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <View style={{width: '100%'}}>
              <TouchableOpacity
                style={{
                  margin: '1%',
                  backgroundColor: '#4AD6E0',
                  height: 60,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '30%',
                }}
                disabled={checkLoaders()}
                onPress={() => {
                  SendSosAlert(SosAlertType.test);
                }}>
                {testLoader && <ActivityIndicator size={25} color="white" />}
                {!testLoader && (
                  <>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../assets/images/test.png')}
                        style={{width: 30, height: 30, tintColor: 'white'}}
                      />
                    </View>

                    <Text
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: 12,
                        fontFamily: semiBold,
                        color: '#FFFFFF',
                      }}>
                      {t('sos:testBtnText')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

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

export default SOSModal;
