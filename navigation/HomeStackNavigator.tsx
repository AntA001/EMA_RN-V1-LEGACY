import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ArticleScreen from '../screens/ArticleScreen';
import HomeScreen from '../screens/HomeScreen';

const HomeStack = createStackNavigator();

const HomeStackNavigator = ({navigation}: any) => {
  return (
    <HomeStack.Navigator initialRouteName="MainHome">
      <HomeStack.Screen
        name="MainHome"
        component={HomeScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <HomeStack.Screen
        name="NewsDetail"
        component={ArticleScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
