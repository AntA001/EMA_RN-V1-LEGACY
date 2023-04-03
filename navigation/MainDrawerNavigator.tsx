import React, {useContext, useEffect, useRef} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import {MainBottomTabNavigator} from './MainBottomTabNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import {AuthContext} from '../components/AuthContext';
import {CheckSignIn} from '../services/AuthenticationAPI';
import {SharedData} from '../services/SharedData';
import NotificationStackNavigator from './NotificationStackNavigator';
import {AppState} from 'react-native';
import {notificationCount} from '../services/UserApi';
import EmergencyContactScreen from '../screens/EmergencyContactScreen';

const Drawer = createDrawerNavigator();

const MainDrawerNavigator = ({navigation}: any) => {
  const {info, setInfo, token, setToken, setUnRead, unRead}: any =
    useContext(AuthContext);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        notificationCount(setUnRead);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage: any) => {
        if (!unRead) {
          setUnRead(true);
        }
        Toast.show({
          type: 'info',
          text1: remoteMessage.notification.title,
          text2: remoteMessage.notification.body,
          autoHide: true,
          visibilityTime: 1500,
          onPress: () => {
            if (remoteMessage) {
              navigation.navigate('Dashboard', {screen: 'Notifications'});
            }
          },
        });
      },
    );
    const unsubscribeonNotificationOpenedApp =
      messaging().onNotificationOpenedApp(async (remoteMessage: any) => {
        if (remoteMessage) {
          if (remoteMessage.data?.route == 'notifications') {
            navigation.navigate('Notifications');
          }
        }
      });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage && remoteMessage?.data?.route == 'notifications') {
          navigation.navigate('Notifications');
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeonNotificationOpenedApp();
    };
  }, []);

  useEffect(() => {
    CheckSignIn(SharedData.UserInfo.fcmToken, navigation);
  }, []);

  return (
    <Drawer.Navigator
      drawerContent={(props: any) => <DrawerContent {...props} />}
      initialRouteName="Main">
      <Drawer.Screen
        name="Main"
        options={{gestureEnabled: false, headerShown: false}}
        component={MainBottomTabNavigator}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <Drawer.Screen
        name="ProfileSettings"
        component={ProfileSettingsScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationStackNavigator}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <Drawer.Screen
        name="EmergencyContact"
        component={EmergencyContactScreen}
        options={{gestureEnabled: false, headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawerNavigator;
