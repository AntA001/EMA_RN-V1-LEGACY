import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpTwoScreen from '../screens/SignUpTwoScreen';
import OtpCodeScreen from '../screens/OtpCodeScreen';
import PhoneScreen from '../screens/PhoneSceen';
import MainDrawerNavigator from './MainDrawerNavigator';
import SignUpThreeScreen from '../screens/SignUpThreeScreen';
import SignInScreen from '../screens/SignInScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import {AuthContext} from '../components/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthStack = createStackNavigator();

const MainStackNavigator = ({initialRoute, navigation}: any) => {
  const {info, setInfo, token, setToken}: any = useContext(AuthContext);

  let retrieveData = async () => {
    try {
      const usertoken = await AsyncStorage.getItem('usertoken');
      const userinfo = await AsyncStorage.getItem('userinfo');
      if (usertoken !== null && userinfo != null) {
        setToken(usertoken);
        setInfo(JSON.parse(userinfo));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  return (
    <AuthStack.Navigator initialRouteName={initialRoute}>
      <AuthStack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <AuthStack.Screen
        name="OtpCode"
        component={OtpCodeScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <AuthStack.Screen
        name="Phone"
        component={PhoneScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <AuthStack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <AuthStack.Screen
        name="ForgetPassword"
        component={ForgetPasswordScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <AuthStack.Screen
        name="SignUpTwo"
        component={SignUpTwoScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <AuthStack.Screen
        name="SignUpThree"
        component={SignUpThreeScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <AuthStack.Screen
        name="Dashboard"
        component={MainDrawerNavigator}
        options={{gestureEnabled: false, headerShown: false}}
      />
    </AuthStack.Navigator>
  );
};

export default MainStackNavigator;
