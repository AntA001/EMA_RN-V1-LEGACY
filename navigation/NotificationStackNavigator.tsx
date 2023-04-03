import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import NotificationsScreen from '../screens/NotificationsScreen';
import NotificationViewScreen from '../screens/NotificationView';

const NotificationStack = createStackNavigator();

const NotificationStackNavigator = ({navigation}: any) => {
  return (
    <NotificationStack.Navigator initialRouteName="MainNotifications">
      <NotificationStack.Screen
        name="MainNotifications"
        component={NotificationsScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <NotificationStack.Screen
        name="Notification"
        component={NotificationViewScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
    </NotificationStack.Navigator>
  );
};

export default NotificationStackNavigator;
