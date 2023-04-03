import React, {createContext, useState} from 'react';
import {View, StatusBar, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {themes} from '../styles/themes';
import GeneralStatusBarColor from './GeneralStatusBar';

export const ThemeContext = createContext();

const setThemePrefStatusBar = theme => {
  if (theme.dark) {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(themes.Dark.colors.statusbarbackgroundcolor);
    }
  } else {
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(
        themes.Light.colors.statusbarbackgroundcolor,
      );
    }
  }
};

const storeData = async theme => {
  try {
    await AsyncStorage.setItem('theme', theme);
  } catch (error) {
    console.log('error store');
  }
};

export const ThemeProvider = ({children, themepref}) => {
  const [theme, setTheme] = useState(
    themepref === 'dark' ? themes.Dark : themes.Light,
  );
  setThemePrefStatusBar(theme);

  const toggleTheme = () => {
    if (theme.dark === false) {
      storeData('dark');
      setTheme(themes.Dark);
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(
          themes.Dark.colors.statusbarbackgroundcolor,
        );
      }
    } else {
      storeData('light');
      setTheme(themes.Light);
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(
          themes.Light.colors.statusbarbackgroundcolor,
        );
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'ios' ? (
        <GeneralStatusBarColor backgroundColor={theme.colors.background} />
      ) : null}
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        {children}
      </ThemeContext.Provider>
    </View>
  );
};
