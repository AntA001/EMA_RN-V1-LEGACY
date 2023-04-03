import React, {useContext, useEffect, useRef} from 'react';
import {useState} from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SignIn} from '../services/AuthenticationAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../components/AuthContext';
import messaging from '@react-native-firebase/messaging';
import {bold, regular, semiBold, light} from '../styles/fonts';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {useTheme} from '@react-navigation/native';

const storeUserToken = async (usertoken: string) => {
  try {
    await AsyncStorage.setItem('usertoken', usertoken);
  } catch (error) {
    console.log('error store');
  }
};

const storeUserInfo = async (userinfo: any) => {
  try {
    await AsyncStorage.setItem('userinfo', JSON.stringify(userinfo));
  } catch (error) {
    console.log('error store');
  }
};

const SignInScreen = ({route, navigation}: any) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordsecure, setPasswordSecure] = React.useState(true);
  const [loader, setLoader] = useState(false);
  const {info, setInfo, token, setToken}: any = useContext(AuthContext);
  const theme: any = useTheme();
  const fcmToken: any = useRef(null);

  const {t, i18n} = useTranslation();

  const selectedLanguageCode = i18n.language;

  const checkLanguage = (code: any) => {
    if (code != selectedLanguageCode) {
      moment().locale('en');
      return i18n.changeLanguage('en');
    }
  };

  const getFcmToken = async () => {
    let enabled = await messaging().requestPermission();
    if (enabled) {
      console.log('Permission status:', enabled);
      let token = await messaging().getToken();
      if (token) {
        fcmToken.current = token;
      }
    }
  };

  useEffect(() => {
    getFcmToken();
  }, []);

  const loginValidationSchema = yup.object().shape({
    email: yup.string().required('Required'),
    password: yup.string().required('Required'),
  });
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
        <View style={{marginHorizontal: '5%', zIndex: 1}}>
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
            {t('signin:title')}
          </Text>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 16,
              fontFamily: regular,
              marginRight: '6%',
            }}>
            {t('signin:description')}
          </Text>
          <Formik
            validationSchema={loginValidationSchema}
            initialValues={{email: '', password: ''}}
            onSubmit={values => {
              if (!loader) {
                setLoader(true);
                SignIn(
                  values.email,
                  password,
                  setLoader,
                  navigation,
                  storeUserToken,
                  storeUserInfo,
                  setInfo,
                  setToken,
                  fcmToken.current,
                  checkLanguage,
                );
              }
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <>
                <View>
                  <TextInput
                    style={[
                      {
                        borderRadius: 10,
                        marginTop: '5%',
                        paddingHorizontal: '5%',
                        color: theme.colors.text,
                        backgroundColor: theme.colors.placeholder,
                        height: 50,
                        fontSize: 16,
                        fontFamily: regular,
                      },
                      shadowStyles.shadow,
                    ]}
                    placeholder={t('signin:emailPhonePlaceHolder')}
                    placeholderTextColor="grey"
                    onLayout={() => {
                      let change = handleChange('email');
                      if (route.params?.phoneNo) {
                        change(route.params?.phoneNo);
                      }
                    }}
                    onChangeText={text => {
                      let change = handleChange('email');
                      change(text);
                    }}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
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
                      {t('signin:emailPhoneExample')}
                    </Text>
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
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
                    onBlur={handleBlur('password')}
                    value={values.password}
                    onChangeText={text => {
                      let change = handleChange('password');
                      if (true) {
                        change(text);
                      }
                      setPassword(text);
                    }}
                    secureTextEntry={passwordsecure}
                    placeholder={t('signin:passwordPlaceHolder')}
                    placeholderTextColor="grey"
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
                {touched.password && errors.password && (
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: 2,
                      alignSelf: 'flex-end',
                      color: 'red',
                      fontFamily: light,
                    }}>
                    {errors.password}
                  </Text>
                )}

                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#2B6AD4',
                      marginVertical: 5,
                      textAlign: 'right',
                      fontFamily: semiBold,
                      paddingHorizontal: 2,
                      paddingVertical: 5,
                    }}
                    onPress={() => {
                      navigation.navigate('ForgetPassword');
                    }}>
                    {t('signin:forgotPassword')}?
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginTop: '5%',
                      backgroundColor: '#2B6AD4',
                      height: 60,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginBottom: '5%',
                      width: '100%',
                    }}
                    onPress={() => {
                      handleSubmit();
                    }}>
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
                        {t('signin:signinBtn')}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
        <Image
          style={{
            position: 'absolute',
            height: Dimensions.get('window').width / 1.7,
            width: Dimensions.get('window').width / 1.7,
            bottom: 0,
            alignSelf: 'center',
            zIndex: 0,
            marginBottom: '2%',
          }}
          source={require('../assets/images/sign-in.png')}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 14,
    color: 'red',
    fontFamily: light,
  },
});

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

export default SignInScreen;
