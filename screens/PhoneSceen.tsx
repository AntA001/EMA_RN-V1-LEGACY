import React, {useEffect, useRef} from 'react';
import {useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {phone} from '../services/AuthenticationAPI';
import {showMessage} from 'react-native-flash-message';
import {bold, regular, semiBold, light} from '../styles/fonts';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {useIsFocused, useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PhoneScreen = ({navigation, route}: any) => {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [loader, setLoader] = useState(false);
  const [valid, setValid] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);
  const retryTime: any = useRef();
  const theme: any = useTheme();
  const {t, i18n} = useTranslation();

  let retrieveData = async () => {
    try {
      const OTPRetryTime = await AsyncStorage.getItem('OTPRetryTime');
      if (OTPRetryTime) {
        retryTime.current = new Date(JSON.parse(OTPRetryTime));
      }
    } catch (error) {
      console.log('retrive error');
    }
  };

  const IsFocused = useIsFocused();

  useEffect(() => {
    if (IsFocused) retrieveData();
  }, [IsFocused]);

  return (
    <>
      <View style={{flex: 1, backgroundColor: theme.colors.background}}>
        <View style={{marginHorizontal: '5%', zIndex: 1}}>
          <Text
            style={{
              fontSize: 26,
              fontFamily: bold,
              color: theme.colors.text,
              marginTop: '10%',
            }}>
            {t('phoneScreen:title')},
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: regular,
              color: theme.colors.text,
              marginTop: '1%',
            }}>
            {t('phoneScreen:description')}
          </Text>
          <View style={{marginTop: '5%'}}>
            <PhoneInput
              withDarkTheme={theme.dark}
              ref={phoneInput}
              defaultValue={value}
              defaultCode="GR"
              placeholder={t('phoneScreen:placeholder')}
              layout="first"
              onChangeText={text => {
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
              textInputStyle={{height: 50, color: theme.colors.text}}
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
              color: '#8199C2',
              marginTop: '2%',
              fontFamily: light,
            }}>
            {t('phoneScreen:phoneExample')}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#2B6AD4',
              marginVertical: 10,

              fontFamily: semiBold,
            }}
            onPress={() => {
              navigation.navigate('SignIn');
            }}>
            {t('phoneScreen:signinEmail')}
          </Text>
          <View>
            <TouchableOpacity
              style={{
                marginTop: '1%',
                backgroundColor: '#2B6AD4',
                height: 60,
                borderRadius: 10,
                justifyContent: 'center',
                marginBottom: '5%',
              }}
              onPress={() => {
                if (formattedValue !== '') {
                  const checkValid = phoneInput.current?.isValidNumber(value);
                  setLoader(!loader);
                  if (!loader && checkValid) {
                    setLoader(true);
                    phone(
                      formattedValue,
                      navigation,
                      setLoader,
                      undefined,
                      retryTime.current
                        ? moment().isBefore(retryTime.current)
                        : false,
                    );
                  } else {
                    showMessage({
                      message: 'Phone Number Not Valid',
                      type: 'warning',
                      icon: 'danger',
                    });
                    setLoader(false);
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
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      color: 'white',
                      fontSize: 16,
                      fontFamily: semiBold,
                    }}>
                    {t('phoneScreen:continueBtn')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Image
          style={{
            position: 'absolute',
            height: Dimensions.get('window').width / 1.5,
            width: Dimensions.get('window').width / 1.5,
            bottom: 0,
            alignSelf: 'center',
            zIndex: 0,
            marginBottom: '2%',
          }}
          source={require('../assets/images/sign-up.png')}
        />
      </View>
    </>
  );
};

export default PhoneScreen;
