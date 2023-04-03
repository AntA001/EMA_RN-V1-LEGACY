import Geolocation from '@react-native-community/geolocation';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextBase,
  Text,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Icon from 'react-native-vector-icons/Feather';
import {regular} from '../styles/fonts';
import SOSModal from './SOSModal';
import {useTheme} from '@react-navigation/native';
import {isIPhoneWithNotch} from './GeneralStatusBar';

const getActiveRouteState = function (routes: any, index: any, name: any) {
  return routes[index].name === name;
};

const CustomTabBar = ({state, descriptors, navigation}: any) => {
  const [sosModal, setSosModal] = useState(false);
  const {t, i18n} = useTranslation();
  const theme: any = useTheme();

  const styles = StyleSheet.create({
    shadow: {
      shadowColor: 'rgba(0,0,0,0.4)',
      shadowOffset: {
        width: 1,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
    },
  });

  return (
    <>
      <SOSModal modalVisible={sosModal} setModalVisible={setSosModal} />

      <View style={[{flexDirection: 'row'}, styles.shadow]}>
        <View
          style={{
            height: isIPhoneWithNotch() ? 80 : 70,
            flexDirection: 'row',
            width: '100%',
          }}>
          <View style={styles.mainContainer}>
            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 60,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: getActiveRouteState(
                  state.routes,
                  state.index,
                  'Home',
                )
                  ? 'rgba(43, 106, 212, 0.5)'
                  : theme.colors.surface,
              }}
              onPress={() => {
                if (!getActiveRouteState(state.routes, state.index, 'Home')) {
                  navigation.navigate('Home');
                }
              }}>
              <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Icon name="home" color={'#2B6AD4'} size={30} />
                <Text
                  style={{
                    color: '#2B6AD4',
                    fontSize: 10,
                    fontFamily: regular,
                    textAlign: 'center',
                  }}>
                  {t('bottomTab:home')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 60,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: getActiveRouteState(
                  state.routes,
                  state.index,
                  'Map',
                )
                  ? 'rgba(0,200,0, 0.3)'
                  : theme.colors.surface,
              }}
              onPress={() => {
                if (!getActiveRouteState(state.routes, state.index, 'Map')) {
                  navigation.navigate('Map');
                }
              }}>
              <Icon name="map-pin" color={'#3CB043'} size={30} />
              <Text
                style={{
                  color: '#3CB043',
                  fontSize: 10,
                  fontFamily: regular,
                  textAlign: 'center',
                }}>
                {t('bottomTab:map')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 60,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: getActiveRouteState(
                  state.routes,
                  state.index,
                  'GuideArticles',
                )
                  ? 'rgba(255, 0, 0, 0.3)'
                  : theme.colors.surface,
              }}
              onPress={() => {
                if (
                  !getActiveRouteState(
                    state.routes,
                    state.index,
                    'GuideArticles',
                  )
                ) {
                  navigation.navigate('GuideArticles');
                }
              }}>
              <Icon name="map" color={'#FF0000'} size={30} />
              <Text
                style={{
                  color: '#FF0000',
                  fontSize: 10,
                  fontFamily: regular,
                  textAlign: 'center',
                }}>
                {t('bottomTab:guides')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 60,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: getActiveRouteState(
                  state.routes,
                  state.index,
                  'UsefulContacts',
                )
                  ? 'rgba(184, 61, 186, 0.3)'
                  : theme.colors.surface,
              }}
              onPress={() => {
                if (
                  !getActiveRouteState(
                    state.routes,
                    state.index,
                    'UsefulContacts',
                  )
                ) {
                  navigation.navigate('UsefulContacts');
                }
              }}>
              <Icon name="users" color={'#b83dba'} size={30} />
              <Text
                style={{
                  color: '#b83dba',
                  fontSize: 10,
                  fontFamily: regular,
                  textAlign: 'center',
                }}>
                {t('bottomTab:contacts')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{backgroundColor: theme.colors.surface}}>
            <Svg
              width={80}
              height={isIPhoneWithNotch() ? 100 : 70}
              viewBox={`2 0 82 ${isIPhoneWithNotch() ? 100 : 70}`}>
              <Path
                d="M 89 0 L 80 0 c -1 55 -75 50 -73 0 L 2 0 L 7 0 C 6 29 30 40 44 40 c 14 0 37 -13 36 -40 z"
                stroke="#BED0EE"
                strokeWidth={2}
                fill="#BED0EE"
              />
              <Path
                d="M 89 0 v 70 H 0 V 0 l 7 0 C 6 29 30 40 44 40 c 14 0 37 -13 36 -40 l 6 0 z"
                fill={theme.colors.surface}
              />
            </Svg>
          </View>
        </View>
        <TouchableOpacity
          style={{
            height: 62,
            width: 62,
            borderRadius: 50,
            position: 'absolute',
            right: 9,
            bottom: isIPhoneWithNotch() ? 45 : 36,
            backgroundColor: '#EB472D',
            zIndex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            if (Platform.OS === 'ios') Geolocation.requestAuthorization();
            setSosModal(true);
          }}>
          <Image
            style={{
              height: 40,
              width: 40,
            }}
            source={require('../assets/images/SOS.png')}
          />
        </TouchableOpacity>

        {/* {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1}}>
            <Text style={{color: isFocused ? '#673ab7' : '#222'}}>{label}</Text>
          </TouchableOpacity>
        );
      })} */}
      </View>
    </>
  );
};

export default CustomTabBar;
