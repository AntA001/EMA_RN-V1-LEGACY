import React from 'react';
import {useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ProfileImage, ProfileImageSkip} from '../services/UserApi';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {bold, regular, semiBold, light} from '../styles/fonts';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';

const SignUpTwoScreen = ({route, navigation}: any) => {
  const token = route.params.token;
  const {t, i18n} = useTranslation();

  const [loader, setLoader] = useState(false);
  const [simage, setSImage] = useState(false);
  const [image, setImage] = useState(
    require('../assets/images/profile-image-holder.png'),
  );
  const theme: any = useTheme();
  const Camera = async () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 600,
        maxWidth: 600,
      },
      (response: any) => {
        if (!response.didCancel) {
          setImage({
            uri: response?.assets[0]?.uri,
            type: response?.assets[0]?.type,
            name: response?.assets[0]?.fileName,
          });
          setSImage(true);
        }
      },
    );
  };

  const Gallery = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 600,
        maxWidth: 600,
      },
      (response: any) => {
        if (!response.didCancel) {
          setImage({
            uri: response?.assets[0]?.uri,
            type: response?.assets[0]?.type,
            name: response?.assets[0]?.fileName,
          });
          setSImage(true);
        }
      },
    );
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
        <View style={{flex: 1, marginHorizontal: '5%'}}>
          <View>
            <TouchableOpacity
              style={{
                marginTop: '3%',
                backgroundColor: theme.colors.surface,
                height: 40,
                width: 40,
                borderRadius: 50,
                justifyContent: 'center',
                marginBottom: '5%',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.goBack();
              }}>
              {<Icon name="arrow-left" size={25} color={theme.colors.icon} />}
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 26,
              fontFamily: bold,
              color: theme.colors.text,
            }}>
            {t('signupTwo:title')}
          </Text>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 16,
              fontFamily: regular,
              marginRight: '6%',
            }}>
            {t('signupTwo:desc')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '5%',
            }}>
            <Text
              style={{
                fontSize: 21,
                fontFamily: bold,
                color: theme.colors.text,
              }}>
              {t('signupTwo:profile')}
            </Text>
            <View
              style={{
                padding: 6,
                marginLeft: '2%',
                backgroundColor: theme.dark ? theme.colors.surface : '#DEEAFB',
                borderRadius: 6,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: regular,
                  color: theme.dark ? theme.colors.surfaceText : '#2B6AD4',
                }}>
                {t('signupTwo:step')}
              </Text>
            </View>
          </View>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {!simage && (
              <>
                <Image
                  source={require('../assets/images/profile-image-holder.png')}
                  style={{height: 70, width: 70}}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: regular,
                    color: theme.dark ? theme.colors.surfaceText : '#8199C2',
                    width: '70%',
                    textAlign: 'center',
                    marginTop: '8%',
                    lineHeight: 25,
                  }}>
                  {t('signupTwo:profileText')}
                </Text>
              </>
            )}
            {simage && (
              <>
                <Image
                  source={image}
                  style={{height: 200, width: 200, borderRadius: 100}}
                />
                <TouchableOpacity
                  style={{marginTop: '5%'}}
                  onPress={() => {
                    setSImage(false);
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: semiBold,
                      color: '#ED1717',
                      textAlign: 'center',
                    }}>
                    {t('signupTwo:delete')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View>
            {!simage && (
              <>
                <TouchableOpacity
                  style={{
                    marginTop: '5%',
                    backgroundColor: '#2B6AD4',
                    height: 60,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginBottom: '2%',
                    width: '100%',
                  }}
                  onPress={Camera}
                  // onPress={handleSubmit}
                  // disabled={!isValid}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontWeight: '700',
                      fontSize: 16,
                      color: '#FFFFFF',
                    }}>
                    {t('signupTwo:takePhoto')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#2B6AD4',
                    height: 60,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginBottom: '2%',
                    width: '100%',
                  }}
                  onPress={Gallery}>
                  <Text
                    style={{
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontWeight: '700',
                      fontSize: 16,
                      color: '#FFFFFF',
                    }}>
                    {t('signupTwo:choose')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {simage && (
              <TouchableOpacity
                style={{
                  marginTop: '5%',
                  backgroundColor: '#2B6AD4',
                  height: 60,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginBottom: '2%',
                  width: '100%',
                }}
                onPress={() => {
                  ProfileImage(image, token, setLoader, navigation);
                }}
                // onPress={handleSubmit}
                // disabled={!isValid}
              >
                {loader && <ActivityIndicator size={25} color="white" />}
                {!loader && (
                  <Text
                    style={{
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontWeight: '700',
                      fontSize: 16,
                      color: '#FFFFFF',
                    }}>
                    {t('signupTwo:continue')}
                  </Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{
                height: 60,
                borderRadius: 10,
                justifyContent: 'center',
                alignSelf: 'center',
                marginBottom: '2%',
                width: '100%',
              }}
              onPress={() => {
                ProfileImageSkip(token, navigation);
              }}
              // disabled={!isValid}
            >
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontWeight: '700',
                  fontSize: 16,
                  color: '#2B6AD4',
                }}>
                {t('signupTwo:skip')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 14,
    color: 'red',
    fontFamily: light,
    alignSelf: 'flex-end',
  },
});

export default SignUpTwoScreen;
