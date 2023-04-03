import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LanguageSettingsScreen from '../screens/LanguageSettingsScreen';
import MunicipalityScreen from '../screens/MunicipalityScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UserCategoryScreen from '../screens/UserCategoryScreen';
import ThemeSettingsScreen from '../screens/ThemeSettingsScreen';

const SettingsStack = createStackNavigator();

const SettingsStackNavigator = ({navigation}: any) => {
  return (
    <SettingsStack.Navigator initialRouteName="MainSettings">
      <SettingsStack.Screen
        name="MainSettings"
        component={SettingsScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <SettingsStack.Screen
        name="LanguageSettings"
        component={LanguageSettingsScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <SettingsStack.Screen
        name="Municipality"
        component={MunicipalityScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <SettingsStack.Screen
        name="UserCategory"
        component={UserCategoryScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <SettingsStack.Screen
        name="ThemeSettings"
        component={ThemeSettingsScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
    </SettingsStack.Navigator>
  );
};

export default SettingsStackNavigator;
