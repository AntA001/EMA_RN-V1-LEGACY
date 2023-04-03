import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import GuidesScreen from '../screens/GuidesScreen';
import GuidesView from '../screens/GuidesView';

const GuideArticlesStack = createStackNavigator();

const GuideArticlesStackNavigator = ({navigation}: any) => {
  return (
    <GuideArticlesStack.Navigator initialRouteName="MainGuideArticles">
      <GuideArticlesStack.Screen
        name="MainGuideArticles"
        component={GuidesScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <GuideArticlesStack.Screen
        name="GuideArticlesDetail"
        component={GuidesView}
        options={{gestureEnabled: false, headerShown: false}}
      />
    </GuideArticlesStack.Navigator>
  );
};

export default GuideArticlesStackNavigator;
