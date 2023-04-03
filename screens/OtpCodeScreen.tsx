import React from 'react';
import {useState, useEffect} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';
import {phone, verifyCode} from '../services/AuthenticationAPI';
import {bold, regular, semiBold} from '../styles/fonts';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {useTheme} from '@react-navigation/native';

const storeOTPRetryTime = async (time: any) => {
  try {
    await AsyncStorage.setItem('OTPRetryTime', JSON.stringify(time));
  } catch (error) {
    console.log('error store');
  }
};

// const storeOTPRetryCount = async (count: any) => {
//   try {
//     await AsyncStorage.setItem('OTPRetryCount', JSON.stringify(count));
//   } catch (error) {
//     console.log('error store');
//   }
// };

const CELL_COUNT = 6;
const OtpCodeScreen = ({route, navigation}: any) => {
  // const pin = route.params.code;
  const phone_no = route.params.phoneNo;
  const [value, setValue] = useState('');
  const [loader, setLoader] = useState(false);
  const [retry, setRetry] = useState(1);
  const [retryTime, setRetryTime]: any = useState(null);
  const theme: any = useTheme();
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const {t, i18n} = useTranslation();
  const styles = StyleSheet.create({
    root: {flex: 1},
    fieldRow: {
      alignItems: 'center',
      marginTop: 20,
    },
    cell: {
      width:  52,
      height: 52,
      lineHeight: 55,
      fontSize: 26,
      fontWeight: '600',
      textAlign: 'center',
      marginHorizontal: '1%',
      borderRadius: 6,
      color: theme.dark ? theme.colors.surfaceText : '#2B6AD4',
      backgroundColor: theme.colors.surface,
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
    focusCell: {
      borderColor: '#000',
    },
  });
  const renderCell = ({index, symbol, isFocused}: any) => {
    let textChild = null;

    if (symbol) {
      textChild = symbol;
    } else if (!symbol && !isFocused) {
      textChild = '•';
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <View style={styles.shadow} key={index.toString()}>
        <Text
          key={index}
          style={[
            styles.cell,
            isFocused && styles.focusCell,
            !symbol && !isFocused && {color: 'grey'},
            {overflow: 'hidden'},
          ]}
          onLayout={getCellOnLayoutHandler(index)}>
          {textChild}
        </Text>
      </View>
    );
  };

  // useEffect(() => {
  //   showMessage({
  //     message: 'Your OTP is: ' + pin,
  //     type: 'info',
  //     icon: 'success',
  //   });
  // }, []);

  const [counter, setCounter] = useState(60);
  useEffect(() => {
    const timer: any =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  // let retrieveData = async () => {
  //   try {
  //     const OTPRetryCount = await AsyncStorage.getItem('OTPRetryCount');
  //     console.log(OTPRetryCount, 231232);
  //     if (OTPRetryCount) {
  //       setRetry(Number(OTPRetryCount));
  //     }
  //   } catch (error) {
  //     console.log('retrive error');
  //   }
  // };

  // useEffect(() => {
  //   retrieveData();
  // }, []);

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
              color: theme.colors.text,
              fontSize: 26,
              fontFamily: bold,
            }}>
            {t('otpScreen:title')}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: regular,
              color: theme.colors.text,
              marginRight: '6%',
            }}>
            {t('otpScreen:description')}
          </Text>
          <View style={styles.fieldRow}>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={renderCell}
              onEndEditing={() => {
                if (value !== '') {
                  if (!loader) {
                    verifyCode(value, phone_no, navigation, setLoader);
                  }
                }
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: '5%',
                marginLeft: '5%',
              }}>
              <Text
                style={{
                  color: theme.colors.text,
                  textAlign: 'center',
                  fontSize: 16,
                  fontFamily: regular,
                }}>
                {t('otpScreen:receiveCode')}?{' '}
              </Text>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: semiBold,
                    color: theme.colors.text,
                  }}>
                  {t('otpScreen:resendCode')}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={{
                  marginTop: '5%',
                  backgroundColor: theme.colors.surface,
                  height: 60,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginBottom: '5%',
                  width: 200,
                }}
                onPress={() => {
                  if (retryTime && moment(retryTime).isBefore(moment())) {
                    phone(
                      phone_no,
                      {navigate: () => {}},
                      setLoader,
                      setCounter,
                    );
                    setRetry(1);
                    // storeOTPRetryCount(1);
                    setRetryTime(null);
                  } else if (retry < 3) {
                    phone(
                      phone_no,
                      {navigate: () => {}},
                      setLoader,
                      setCounter,
                    );
                    setRetry(retry + 1);
                    // storeOTPRetryCount(retry + 1);
                  } else {
                    showMessage({
                      message:
                        'Number of tries exceeded please make sure you are using the correct phone number and try again in 24 hours',
                      type: 'warning',
                      icon: 'warning',
                    });
                    let time = moment().add(24, 'h');
                    if (!retryTime) {
                      setRetryTime(time);
                      storeOTPRetryTime(time.toString());
                    }
                  }
                }}
                disabled={counter > 0 ? true : false}>
                {loader && <ActivityIndicator size={25} color="#2B6AD4" />}
                {!loader && (
                  <Text
                    style={{
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      color: theme.dark ? theme.colors.surfaceText : '#2B6AD4',
                      fontSize: 16,
                      fontFamily: semiBold,
                    }}>
                    {counter > 0
                      ? ' 0:' + String(counter).padStart(2, '0')
                      : t('otpScreen:resendCode')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
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
      </SafeAreaView>
    </>
  );
};

export default OtpCodeScreen;
