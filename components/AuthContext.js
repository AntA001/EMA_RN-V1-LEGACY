import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {notificationCount} from '../services/UserApi';
import {updateUserData} from '../services/UserApi';

const AuthContext = createContext({});

const AuthProvider = ({children}) => {
  const [token, setToken] = useState();
  const [info, setInfo] = useState();
  const [unRead, setUnRead] = useState(false);

  // Get current auth state from AsyncStorage
  const getAuthState = async () => {
    try {
      const usertoken = await AsyncStorage.getItem('usertoken');
      const userinfo = await AsyncStorage.getItem('userinfo');
      if (usertoken !== null && userinfo != null) {
        setToken(usertoken);
        setInfo(JSON.parse(userinfo));
        notificationCount(setUnRead);
        updateUserData(JSON.parse(userinfo), setInfo);
      }
    } catch (error) {
      console.log('retrive error');
    }
  };

  // Update AsyncStorage & context state
  const setAuth = async (token, info) => {
    setToken(token);
    setInfo(info);
  };

  useEffect(() => {
    getAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{info, setInfo, token, setToken, unRead, setUnRead}}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
