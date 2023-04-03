import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabBar from '../components/CustomTabBar';
import UsefulContactsScreen from '../screens/UsefulContactsScreen';
import MapsScreen from '../screens/MapScreen';
import HomeStackNavigator from './HomeStackNavigator';
import GuideArticlesStackNavigator from './GuideArticlesStackNavigator';

const BottomTab = createBottomTabNavigator();

export function MainBottomTabNavigator({navigation}: any) {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBar={props => <CustomTabBar {...props} />}>
      <BottomTab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{headerShown: false}}
      />
      <BottomTab.Screen
        name="Map"
        component={MapsScreen}
        options={{headerShown: false}}
      />
      <BottomTab.Screen
        name="GuideArticles"
        component={GuideArticlesStackNavigator}
        options={{headerShown: false}}
      />
      <BottomTab.Screen
        name="UsefulContacts"
        component={UsefulContactsScreen}
        options={{headerShown: false}}
      />
    </BottomTab.Navigator>
  );
}
