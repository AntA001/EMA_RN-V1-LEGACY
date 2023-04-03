import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, View, PermissionsAndroid} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import MainStackNavigator from './navigation/MainStackNavigator';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SharedData} from './services/SharedData';
import {AuthProvider} from './components/AuthContext';
import Toast from 'react-native-toast-message';
import './constants/IMLocalize';
import messaging from '@react-native-firebase/messaging';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import 'moment/locale/sq';
import 'moment/locale/el';
import 'moment/locale/mk';
import 'moment/locale/bg';
import {ThemeContext, ThemeProvider} from './components/ThemeContext';
import {storePermissionStatus} from './services/UserApi';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const NavWithTheme = ({route, navigationRef}: any) => {
  let {theme} = useContext(ThemeContext);

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      <MainStackNavigator initialRoute={route} />
      <FlashMessage position="top" />
      <Toast />
    </NavigationContainer>
  );
};

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'EMA Location Permission',
        message: 'EMA needs access to your Location.',
        // buttonNeutral: "Ask Me Later",
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Granted');
      storePermissionStatus('Granted');
    } else {
      console.log('Denied');
      storePermissionStatus('Denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const App = () => {
  const [themePreference, setThemePreference]: any = useState();
  const [userToken, setUsertoken]: any = useState();

  const navigationRef: any = React.createRef();

  function navigate(name: string, params: any) {
    navigationRef.current && navigationRef.current.navigate(name, params);
  }

  const {t, i18n} = useTranslation();

  const selectedLanguageCode = i18n.language;

  useEffect(() => {
    if (selectedLanguageCode == 'al') {
      moment.locale('sq');
    } else if (selectedLanguageCode == 'el') {
      moment.locale('el');
    } else if (selectedLanguageCode == 'mk') {
      moment.locale('mk');
    } else if (selectedLanguageCode == 'bg') {
      moment.locale('bg');
    } else {
      moment.locale('en');
    }
  }, [selectedLanguageCode]);

  let retrieveData = async () => {
    try {
      const theme = await AsyncStorage.getItem('theme');
      const usertoken = await AsyncStorage.getItem('usertoken');
      const userinfo = await AsyncStorage.getItem('userinfo');
      const permission = await AsyncStorage.getItem('permission');
      if (usertoken !== null && userinfo != null) {
        SharedData.UserToken = usertoken;
        SharedData.UserInfo = JSON.parse(userinfo);
        SharedData.Permission = permission;
        setUsertoken(usertoken);
      } else {
        requestLocationPermission();
        setUsertoken(null);
      }
      if (theme) {
        if (theme === 'dark') {
          setThemePreference(theme);
        } else {
          setThemePreference('light');
        }
      } else {
        setThemePreference('light');
      }
    } catch (error) {
      console.log('retrive error');
    }
  };

  useEffect(() => {
    retrieveData();
    requestUserPermission();
  }, []);

  if (!themePreference) {
    return <View></View>;
  } else {
    if (userToken === null) {
      SplashScreen.hide();
      return (
        <AuthProvider>
          <ThemeProvider themepref={themePreference}>
            <NavWithTheme route="Welcome" navigationRef={navigationRef} />
          </ThemeProvider>
        </AuthProvider>
      );
    } else if (userToken) {
      SplashScreen.hide();
      return (
        <AuthProvider>
          <ThemeProvider themepref={themePreference}>
            <NavWithTheme route="Dashboard" navigationRef={navigationRef} />
          </ThemeProvider>
        </AuthProvider>
      );
    } else {
      return <View></View>;
    }
  }
};

export default App;
