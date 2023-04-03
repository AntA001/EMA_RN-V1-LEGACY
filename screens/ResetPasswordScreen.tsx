import React from 'react';
import {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useBlurOnFulfill} from 'react-native-confirmation-code-field';
import {ResetPassword} from '../services/AuthenticationAPI';
import {BoxPasswordStrengthDisplay} from 'react-native-password-strength-meter';
import {bold, regular, semiBold, light} from '../styles/fonts';
import {useTranslation} from 'react-i18next';
import { useTheme } from '@react-navigation/native';

const loginValidationSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Password must match'),
});

const ResetPasswordScreen = ({route, navigation}: any) => {
  const [loader, setLoader] = useState(false);
  const CELL_COUNT = 6;
  const {t, i18n} = useTranslation();
  const [resetcode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfrimPassword] = useState('');
  const [passwordsecure, setPasswordSecure] = useState(true);
  const [confirm_passwordsecure, setConfirmPasswordSecure] = useState(true);
  const theme: any = useTheme();
  const [value, setValue] = useState('');
  const [containSymbol, setContainSymbol] = useState(false);
  const [containNumber, setContainNumber] = useState(false);
  const [minLength, setMinLength] = useState(false);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
        <ScrollView
          style={{marginHorizontal: '5%'}}
          showsVerticalScrollIndicator={false}>
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
            {t('resetPassword:title')}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: regular,
              color: theme.colors.text,
              marginRight: '6%',
            }}>
            {t('resetPassword:desc')}
          </Text>

          <Formik
            validationSchema={loginValidationSchema}
            initialValues={{
              resetcode: '',
              password: '',
              confirm_password: '',
            }}
            onSubmit={values => {
              if (!loader) {
                setLoader(true);
                ResetPassword(
                  values.resetcode,
                  password,
                  setLoader,
                  navigation,
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
                      },
                      shadowStyles.shadow,
                    ]}
                    placeholder={t('resetPassword:code')}
                    placeholderTextColor={theme.colors.placeholderText}
                    onChangeText={(text: string) => {
                      let change = handleChange('resetcode');
                      change(text);
                    }}
                    onBlur={handleBlur('resetcode')}
                    value={values.resetcode}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '2%',
                    }}>
                    {touched.resetcode && errors.resetcode && (
                      <Text style={styles.errorText}>{errors.resetcode}</Text>
                    )}
                  </View>
                </View>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '5%',
                      borderRadius: 10,
                      backgroundColor: theme.colors.placeholder,
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
                      height: 50,
                    }}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    onChangeText={text => {
                      let change = handleChange('password');
                      change(text);
                      setPassword(text);
                      if (text.length > 6) {
                        setMinLength(true);
                        let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                        if (spChars.test(text)) {
                          setContainSymbol(true);
                        } else {
                          if (containSymbol) {
                            setContainSymbol(false);
                          }
                        }
                        const regex = /\d/;

                        if (regex.test(text)) {
                          setContainNumber(true);
                        } else {
                          if (containNumber) {
                            setContainNumber(false);
                          }
                        }
                      } else {
                        if (minLength) {
                          setMinLength(false);
                        }
                        if (containSymbol) {
                          setContainSymbol(false);
                        }

                        if (containNumber) {
                          setContainNumber(false);
                        }
                      }
                    }}
                    secureTextEntry={passwordsecure} //we just added this
                    placeholder={t('resetPassword:password')}
                    placeholderTextColor={theme.colors.placeholderText}
                  />

                  <View style={{alignItems: 'center', width: '10%'}}>
                    <Icon
                      style={{paddingTop: 8, paddingBottom: 8}}
                      name={passwordsecure ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={theme.colors.icon}
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
                <View style={{alignItems: 'center'}}>
                  <BoxPasswordStrengthDisplay
                    password={password}
                    minLength={6}
                    boxColor="#C7C7C7"
                    width={
                      Dimensions.get('screen').width -
                      (Dimensions.get('screen').width / 100) * 10
                    }
                    levels={[
                      {
                        label: 'Weak',
                        labelColor: '#2B6AD4',
                        activeBarColor: '#2B6AD4',
                      },
                      {
                        label: 'Average',
                        labelColor: '#2B6AD4',
                        activeBarColor: '#2B6AD4',
                      },
                      {
                        label: 'Fair',
                        labelColor: '#2B6AD4',
                        activeBarColor: '#2B6AD4',
                      },
                      {
                        label: 'Strong',
                        labelColor: '#2B6AD4',
                        activeBarColor: '#2B6AD4',
                      },
                    ]}></BoxPasswordStrengthDisplay>
                </View>
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View>
                      <Icon
                        name="check-circle-outline"
                        size={18}
                        style={{color: containSymbol ? 'green' : 'gray'}}
                      />
                    </View>
                    <View style={{marginLeft: 5}}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: theme.colors.text,
                          fontFamily: light,
                        }}>
                        {t('resetPassword:containSymobol')}
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View>
                      <Icon
                        name="check-circle-outline"
                        size={18}
                        style={{color: containNumber ? 'green' : 'gray'}}
                      />
                    </View>
                    <View style={{marginLeft: 5}}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: theme.colors.text,
                          fontFamily: light,
                        }}>
                        {t('resetPassword:containNumber')}{' '}
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View>
                      <Icon
                        name="check-circle-outline"
                        size={18}
                        style={{color: minLength ? 'green' : 'gray'}}
                      />
                    </View>
                    <View style={{marginLeft: 5}}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: theme.colors.text,
                          fontFamily: light,
                        }}>
                        {t('resetPassword:addmore')}{' '}
                      </Text>
                    </View>
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
                      height: 50,
                    }}
                    onChangeText={text => {
                      let change = handleChange('confirm_password');
                      change(text);
                    }}
                    onBlur={handleBlur('confirm_password')}
                    value={values.confirm_password}
                    secureTextEntry={confirm_passwordsecure} //we just added this
                    placeholder={t('resetPassword:confrimPassword')}
                    placeholderTextColor={theme.colors.placeholderText}
                  />
                  <View style={{alignItems: 'center', width: '10%'}}>
                    <Icon
                      style={{paddingTop: 8, paddingBottom: 8}}
                      name={
                        confirm_passwordsecure
                          ? 'eye-off-outline'
                          : 'eye-outline'
                      }
                      size={20}
                      color={theme.colors.icon}
                      onPress={() =>
                        setConfirmPasswordSecure(!confirm_passwordsecure)
                      }
                    />
                  </View>
                </View>
                {touched.confirm_password && errors.confirm_password && (
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: 2,
                      alignSelf: 'flex-end',
                      color: 'red',
                      fontFamily: light,
                    }}>
                    {errors.confirm_password}
                  </Text>
                )}

                <View>
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
                      //  disabled={!isValid}
                    }}>
                    {loader && <ActivityIndicator size={25} color="white" />}
                    {!loader && (
                      <>
                        <Text
                          style={{
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontWeight: '700',
                            fontSize: 16,
                            color: '#FFFFFF',
                          }}>
                          {t('resetPassword:continue')}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    fontFamily: light,
  },
  loginContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    elevation: 10,
  },
  textInput: {
    height: 40,
    width: '100%',
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
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

export default ResetPasswordScreen;
