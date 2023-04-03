import React, {useContext, useEffect, useRef} from 'react';
import {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Formik} from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getCountry, getMuniciplity} from '../services/AuthenticationAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {saveMunicipilityDetail} from '../services/UserApi';
import {AuthContext} from '../components/AuthContext';
import messaging from '@react-native-firebase/messaging';
import {bold, regular, semiBold, light} from '../styles/fonts';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import axios from 'axios';
import {BaseURL} from '../services/constants';
import CategoryPasswordModal from '../components/CategoryPasswordModal';

const loginValidationSchema = yup.object().shape({
  category: yup.string().required('category is Required'),
  country: yup.string().required('country is Required'),
  municipal: yup.string().required('municipal is required'),
});

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

const SignUpThreeScreen = ({route, navigation}: any) => {
  const tokenTemp = route.params.token;
  const [loader, setLoader] = useState(false);
  const [catDropDown, setCatDropDown] = useState(false);
  const [category, setCategory] = useState([]);
  const [categoryData, setCategoryData]: any = useState([]);
  const [countryDropDown, setCountryDropDown] = useState(false);
  const [country, setCountry] = useState([]);
  const [muniDropDown, setMuniDropDown] = useState(false);
  const [municipal, setMunicipal] = useState([]);
  const {setInfo, setToken}: any = useContext(AuthContext);
  const {t, i18n} = useTranslation();
  const theme: any = useTheme();
  const selectedLanguageCode = i18n.language;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem]: any = useState(null);

  const formikRef: any = useRef();

  const checkLanguage = (code: any) => {
    if (code != selectedLanguageCode) {
      return i18n.changeLanguage('en');
    }
  };

  const setUserCategory = (id: any) => {
    if (modalVisible) {
      setModalVisible(false);
      setSelectedItem(false);
    }
    formikRef.current.setFieldValue('category', id);
  };

  const getCategory = async (
    languageCode: string,
    setCategory: any,
    setCategoryData: any,
  ) => {
    axios.get(BaseURL + '/public/category/list').then(function (response) {
      if (response.data.success === true) {
        let categories: any = [];
        setCategoryData(response.data.data);
        response.data.data.forEach((e: any) => {
          let category: any = {
            label: e['name' + languageCode.toUpperCase()],
            value: e._id,
          };
          if (e?.locked) {
            category.icon = () => {
              return (
                <Icon name="lock-outline" size={20} color={theme.colors.icon} />
              );
            };
          }
          categories.push(category);
        });
        setCategory([...categories]);
      }
    });
  };

  const fcmToken: any = useRef(null);

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
  theme.dark
    ? DropDownPicker.setTheme('DARK')
    : DropDownPicker.setTheme('LIGHT');
  useEffect(() => {
    getFcmToken();
    getCountry(i18n.language, setCountry);
    getCategory(i18n.language, setCategory, setCategoryData);
  }, []);

  return (
    <>
      <CategoryPasswordModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedItem={selectedItem}
        selectUserCategory={setUserCategory}
      />
      <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
        <View style={{marginHorizontal: '5%'}}>
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
            {t('signupThree:title')}
          </Text>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 16,
              fontFamily: regular,
              marginRight: '6%',
            }}>
            {t('signupThree:desc')}
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
              {t('signupThree:muni')}
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
                {t('signupThree:step')}
              </Text>
            </View>
          </View>
          <Formik
            validationSchema={loginValidationSchema}
            innerRef={formikRef}
            initialValues={{category: '', country: '', municipal: ''}}
            onSubmit={values => {
              if (!loader) {
                setLoader(true);
                saveMunicipilityDetail(
                  tokenTemp,
                  values.category,
                  values.municipal,
                  navigation,
                  storeUserToken,
                  storeUserInfo,
                  setLoader,
                  setToken,
                  setInfo,
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
              <View style={{flex: 1}}>
                <View
                  style={[
                    {
                      marginTop: '5%',
                      height: 60,
                    },
                    Platform.OS === 'ios' ? {zIndex: 5} : {},
                  ]}>
                  <DropDownPicker
                    textStyle={{
                      fontSize: 16,
                      fontFamily: regular,
                      color: theme.colors.text,
                    }}
                    placeholder={t('signupThree:placeCat')}
                    open={catDropDown}
                    value={values.category}
                    items={category}
                    setOpen={setCatDropDown}
                    setValue={item => {
                      if (item() !== values.category) {
                        let index = categoryData.findIndex(
                          (cat: any) => item() === cat._id,
                        );
                        if (index > -1 && categoryData[index]?.locked) {
                          setSelectedItem(categoryData[index]);
                          setModalVisible(true);
                        } else {
                          let change = handleChange('category');
                          change(item());
                        }
                      }
                    }}
                    style={{backgroundColor: theme.colors.placeholder}}
                    zIndex={2006}
                    zIndexInverse={2006}
                  />
                  {errors.category && (
                    <Text style={styles.errorText}>{errors.category}</Text>
                  )}
                </View>
                <View
                  style={[
                    {
                      marginTop: '5%',
                      height: 60,
                    },
                    Platform.OS === 'ios' ? {zIndex: 4} : {},
                  ]}>
                  <DropDownPicker
                    textStyle={{
                      fontSize: 16,
                      fontFamily: regular,
                      color: theme.colors.text,
                    }}
                    placeholder={t('signupThree:placeCountry')}
                    open={countryDropDown}
                    value={values.country}
                    items={country}
                    setOpen={setCountryDropDown}
                    setValue={item => {
                      if (item() !== values.country) {
                        let change = handleChange('country');
                        change(item());
                        getMuniciplity(i18n.language, setMunicipal, item());
                      }
                    }}
                    style={{backgroundColor: theme.colors.placeholder}}
                    zIndex={2005}
                    zIndexInverse={2005}
                  />
                  {errors.country && (
                    <Text style={styles.errorText}>{errors.country}</Text>
                  )}
                </View>
                <View
                  style={[
                    {
                      marginTop: '5%',
                      height: 60,
                    },
                    Platform.OS === 'ios' ? {zIndex: 3} : {},
                  ]}>
                  <DropDownPicker
                    searchable={true}
                    textStyle={{
                      fontSize: 16,
                      fontFamily: regular,
                      color: theme.colors.text,
                    }}
                    placeholder={t('signupThree:placeMuni')}
                    open={muniDropDown}
                    value={values.municipal}
                    items={municipal}
                    setOpen={setMuniDropDown}
                    setValue={item => {
                      if (item() !== values.municipal) {
                        let change = handleChange('municipal');
                        change(item());
                      }
                    }}
                    style={{backgroundColor: theme.colors.placeholder}}
                    zIndex={2000}
                    zIndexInverse={2000}
                    listMode={'MODAL'}
                    theme={theme.dark ? 'DARK' : 'LIGHT'}
                  />
                  {errors.municipal && (
                    <Text style={styles.errorText}>{errors.municipal}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={{
                    marginTop: '15%',
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
                    <>
                      <Text
                        style={{
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          color: '#FFFFFF',
                          fontSize: 16,
                          fontFamily: semiBold,
                        }}>
                        {t('signupThree:btn')}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
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

export default SignUpThreeScreen;
